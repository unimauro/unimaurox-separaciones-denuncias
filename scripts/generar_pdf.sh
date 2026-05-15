#!/usr/bin/env bash
#
# Convierte una plantilla en Markdown a PDF con formato de documento oficial.
#
# Uso:
#   ./scripts/generar_pdf.sh plantillas/01-ministerio-publico.md
#   ./scripts/generar_pdf.sh plantillas/01-ministerio-publico.md --vars vars.env
#
# Si se pasa --vars vars.env, los placeholders {{NOMBRE_COMPLETO}}, {{DNI}}, etc.
# se reemplazan con los valores definidos en vars.env (formato KEY=value por línea).

set -euo pipefail

if [[ $# -lt 1 ]]; then
    echo "Uso: $0 <archivo.md> [--vars vars.env]"
    exit 1
fi

INPUT="$1"
VARS_FILE=""

shift
while [[ $# -gt 0 ]]; do
    case "$1" in
        --vars)
            VARS_FILE="$2"
            shift 2
            ;;
        *)
            echo "Opción desconocida: $1"
            exit 1
            ;;
    esac
done

if [[ ! -f "$INPUT" ]]; then
    echo "Error: no existe el archivo $INPUT"
    exit 1
fi

if ! command -v pandoc &>/dev/null; then
    echo "Error: pandoc no está instalado. Instala con: brew install pandoc"
    exit 1
fi

# Directorio raíz del repo (asumiendo que el script está en scripts/).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SALIDA_DIR="$REPO_ROOT/salida"
mkdir -p "$SALIDA_DIR"

BASENAME="$(basename "$INPUT" .md)"
TMP_MD="$(mktemp -t "${BASENAME}.XXXXXX.md")"
trap 'rm -f "$TMP_MD"' EXIT

# Copia base.
cp "$INPUT" "$TMP_MD"

# Reemplazo de variables si se proveyó archivo.
if [[ -n "$VARS_FILE" ]]; then
    if [[ ! -f "$VARS_FILE" ]]; then
        echo "Error: no existe el archivo de variables $VARS_FILE"
        exit 1
    fi
    while IFS='=' read -r key value; do
        # Saltar comentarios y líneas vacías.
        [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue
        # Quitar espacios alrededor de la clave.
        key="$(echo "$key" | xargs)"
        # Escapar para sed (caracteres especiales en value).
        value_escaped="$(printf '%s\n' "$value" | sed -e 's/[\/&]/\\&/g')"
        sed -i.bak "s/{{${key}}}/${value_escaped}/g" "$TMP_MD"
    done <"$VARS_FILE"
    rm -f "$TMP_MD.bak"
fi

# Salida.
OUTPUT_PDF="$SALIDA_DIR/${BASENAME}.pdf"
OUTPUT_DOCX="$SALIDA_DIR/${BASENAME}.docx"

# Engine: xelatex > pdflatex.
PDF_ENGINE=""
if command -v xelatex &>/dev/null; then
    PDF_ENGINE="xelatex"
elif command -v pdflatex &>/dev/null; then
    PDF_ENGINE="pdflatex"
else
    echo "Advertencia: no hay xelatex ni pdflatex. Solo se generará DOCX."
fi

# Genera PDF si hay engine.
if [[ -n "$PDF_ENGINE" ]]; then
    echo "Generando PDF con $PDF_ENGINE..."
    pandoc "$TMP_MD" \
        -o "$OUTPUT_PDF" \
        --pdf-engine="$PDF_ENGINE" \
        -V geometry:margin=2.5cm \
        -V geometry:a4paper \
        -V fontsize=11pt \
        -V mainfont="Times New Roman" \
        -V documentclass=article \
        -V linkcolor=black \
        --metadata title="" \
        2>/dev/null || {
        echo "Falló con $PDF_ENGINE. Reintentando sin fuente personalizada..."
        pandoc "$TMP_MD" \
            -o "$OUTPUT_PDF" \
            --pdf-engine="$PDF_ENGINE" \
            -V geometry:margin=2.5cm \
            -V geometry:a4paper \
            -V fontsize=11pt \
            -V documentclass=article
    }
    echo "  → $OUTPUT_PDF"
fi

# Genera DOCX siempre — útil para edición posterior y para envío directo.
echo "Generando DOCX..."
pandoc "$TMP_MD" -o "$OUTPUT_DOCX"
echo "  → $OUTPUT_DOCX"

echo "Listo."
