# unimaurox-separaciones-denuncias

Dashboard comparado y plantillas de solicitud de información sobre el sistema de justicia familiar y violencia de género en América Latina, con foco en Perú.

Dos artefactos en un solo repo:

1. **Dashboard estático** (`index.html` y carpetas `data/`, `js/`, `css/`) — visualiza feminicidios, homicidios por sexo, divorcios, suicidios, denuncias por Ley 30364, prisión por deuda alimentaria y marco legal comparado, con datos de CEPAL, UNODC, OMS, MP, MIMP, INPE y RENIEC.
2. **Plantillas Ley 27806** (`plantillas/`) — solicitudes de acceso a la información pública para ocho instituciones del Estado peruano, orientadas a conseguir los indicadores que aún no son públicos (motivos específicos de archivamiento, costos económicos, salud mental y suicidio asociado a procesos, etc.).

## Cómo ver el dashboard

### Local

```bash
cd unimaurox-separaciones-denuncias
python3 -m http.server 8000
# abre http://localhost:8000
```

(Requiere servir por HTTP — abrir `index.html` con doble clic no funciona porque los `fetch` a `data/*.json` fallan sobre `file://`.)

### GitHub Pages

1. Subir el repo a GitHub.
2. `Settings → Pages → Branch: main → Folder: / (root) → Save`.
3. URL queda en `https://<owner>.github.io/unimaurox-separaciones-denuncias/`.

El archivo `.nojekyll` evita que GitHub Pages procese con Jekyll. Si cambias el owner del repo, edita `REPO_OWNER` y `REPO_NAME` al inicio de `js/main.js`.

## Estructura del repo

```
unimaurox-separaciones-denuncias/
├── index.html                       dashboard, entry point
├── css/style.css
├── js/
│   ├── charts.js                    helpers de Chart.js
│   └── main.js                      carga datos, render, GH Pages config
├── data/                            JSON editables — fuentes documentadas
│   ├── feminicidios_latam.json
│   ├── homicidios_hombres_latam.json
│   ├── divorcios_latam.json
│   ├── suicidios_sexo_latam.json
│   ├── peru_temporal.json
│   ├── marco_legal.json
│   └── sources.json
├── plantillas/                      8 solicitudes Ley 27806
│   ├── 01-ministerio-publico.md
│   ├── 02-inpe.md
│   ├── 03-poder-judicial.md
│   ├── 04-mimp.md
│   ├── 05-inei.md
│   ├── 06-defensoria-pueblo.md
│   ├── 07-reniec.md
│   └── 08-sunafil.md
├── guias/
│   ├── ley-27806-basico.md          qué dice la ley, plazos, costos
│   ├── procedimiento.md             cómo enviar, dónde, qué exigir
│   └── que-hacer-si-niegan.md       reclamo administrativo + hábeas data
├── scripts/
│   └── generar_pdf.sh               convierte .md a PDF con pandoc
├── salida/                          PDFs generados (gitignored)
├── vars.env.ejemplo                 datos personales para sustituir placeholders
├── .nojekyll                        flag para GitHub Pages
├── .gitignore
└── LICENSE                          CC0 — dominio público
```

## Cómo actualizar los datos

Los archivos en `data/` son JSON simples con su `fuente`, `anio_referencia` y `advertencia`. Para refrescar:

1. Verificar la fuente original (CEPAL OIG, dataunodc.un.org, GHO de la OMS, boletines MP/MIMP/INPE/RENIEC).
2. Editar el JSON con los nuevos valores y actualizar `anio_referencia`.
3. Recargar la página — los gráficos se regeneran.

## Cómo enviar una solicitud Ley 27806

1. Copiar `vars.env.ejemplo` a `vars.env` y rellenar con tus datos.
2. Generar PDF y DOCX:
   ```bash
   ./scripts/generar_pdf.sh plantillas/01-ministerio-publico.md --vars vars.env
   ```
   Los archivos quedan en `salida/`.
3. Firmar y enviar por mesa de partes virtual de la entidad. Detalles en `guias/procedimiento.md`.
4. Plazo legal: **10 días hábiles** (Art. 11 inc. b TUO de la Ley 27806).
5. Si niegan o no responden: `guias/que-hacer-si-niegan.md`.

## Advertencia metodológica

El dashboard distingue explícitamente entre indicadores con dato directo (feminicidios, divorcios, presos OAF, denuncias 30364) e indicadores que requieren proxies o solicitud (motivo de archivamiento, costos al denunciado, suicidio asociado al proceso).

**Archivamiento ≠ denuncia falsa.** Un archivamiento puede deberse a atipicidad, falta de pruebas, no individualización, principio de oportunidad o prescripción. La cifra de denuncia falsa probada (Art. 402 CP en Perú) es mucho menor y solo se obtiene desagregando el motivo del archivamiento — dato no público que la plantilla 01 solicita formalmente.

## Licencia

Plantillas y código: CC0 — dominio público. Reutilizar libremente.
Datos: cada uno bajo la licencia de su fuente original (CEPAL OIG, UNODC, OMS, INEI Perú, etc.).

## Contribuir

Aporta datos verificados, errores en plantillas, o nuevos países/indicadores vía GitHub Issues.
