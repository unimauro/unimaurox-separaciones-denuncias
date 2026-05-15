# Procedimiento de envío

## Paso 1 — Identifica el portal correcto

Cada entidad tiene mesa de partes virtual. Lista actualizada al momento de redacción (verificar antes de enviar):

| Institución | Mesa de partes virtual | Funcionario responsable (consultar) |
|---|---|---|
| Ministerio Público | mpfn.gob.pe → Mesa de Partes Virtual | Portal de Transparencia / Acceso a Información |
| INPE | inpe.gob.pe → Atención al Ciudadano | Portal de Transparencia |
| Poder Judicial | pj.gob.pe → Mesa de Partes Electrónica (MPE) | Portal de Transparencia |
| MIMP | mimp.gob.pe → Mesa de Partes Virtual | Portal de Transparencia |
| INEI | inei.gob.pe → Atención al Ciudadano | Portal de Transparencia |
| Defensoría del Pueblo | defensoria.gob.pe → Consultas y trámites | Portal de Transparencia |
| RENIEC | reniec.gob.pe → Atención al Ciudadano | Portal de Transparencia |
| SUNAFIL | sunafil.gob.pe → Mesa de Partes Virtual | Portal de Transparencia |

El nombre y correo del funcionario responsable cambia. Búscalo siempre en el portal de transparencia de la entidad antes de enviar.

## Paso 2 — Prepara la solicitud

1. Rellena la plantilla correspondiente reemplazando todos los marcadores `{{...}}`.
2. Convierte a PDF con `./scripts/generar_pdf.sh plantillas/XX-entidad.md`.
3. Firma. Si tienes firma digital (Reniec), úsala. Si no, imprime, firma y escanea, o usa firma manuscrita digital.

## Paso 3 — Adjuntos obligatorios

- Copia simple de DNI (frontal).
- Si actúas en representación: carta poder simple o documento que acredite la representación.

## Paso 4 — Envío

Opción A — **Mesa de partes virtual** (recomendado):

- Subir PDF de solicitud + DNI.
- Anotar número de expediente o cargo electrónico que devuelve el sistema.
- Guardar captura del envío y del cargo. Esa fecha es la que cuenta para el plazo.

Opción B — **Mesa de partes física**:

- Llevar dos ejemplares.
- Exigir sello, fecha y número de registro en uno de ellos. Ese es tu cargo.

Opción C — **Correo electrónico al funcionario responsable**:

- Válido jurídicamente (Art. 10 del Reglamento permite vía electrónica).
- Pedir acuse de recibo expreso. Guardar.

## Paso 5 — Seguimiento

- Anota la fecha de presentación en tu registro.
- A los 8 días hábiles: enviar correo recordando que el plazo vence en 2 días.
- A los 11 días hábiles sin respuesta: configurada la **denegación ficta**.
- A los 18 días hábiles (si hubo prórroga válida): segunda denegación ficta.

## Paso 6 — Cuando llegue la respuesta

- Revisar que entreguen **todo** lo solicitado. Si entregan parcialmente sin justificar por qué excluyen lo demás, eso también es denegación.
- Si invocan excepción (secreto, reserva, confidencialidad): exigir que **citen el artículo específico** y motiven en relación a tu pedido. La motivación genérica es nula.
- Si los datos llegan en PDF escaneado sin posibilidad de extraer texto: pedir el formato fuente (Excel, CSV). El Art. 10 da derecho a elegir el formato; en datos estadísticos el formato fuente es obligatorio cuando existe.

## Buenas prácticas para maximizar lo que entregan

1. **Pide rango temporal amplio** (ej. 2010-2025) y desagregación máxima desde el inicio. Es más fácil que entreguen mucho que volver a pedir.
2. **Pide el dato Y el diccionario de variables.** Una tabla sin diccionario es inútil.
3. **Pide formato CSV o Excel** explícitamente. PDF es contrario al espíritu de datos abiertos.
4. **Pide la metodología de captura** del dato (cómo se registra, quién lo digita, qué validaciones tiene). Sin metodología no se puede auditar.
5. **Solicita también la información en bruto y la agregada.** Lo agregado lo procesa la entidad, lo bruto te permite reanálisis.
6. **Si hay duda sobre confidencialidad: pide la versión agregada/anonimizada.** Esa nunca cae en excepción.
7. **Cita los artículos del TUO en la propia solicitud** (las plantillas lo hacen). Eso reduce el margen de la entidad para excusarse.

## Si tienes que insistir

Una segunda solicitud aclarando o reduciendo el alcance no cuenta como abuso. Las solicitudes reiteradas y vejatorias sí podrían ser desestimadas; pero pedir más datos sobre lo mismo o precisar tras una respuesta incompleta es legítimo y frecuente.
