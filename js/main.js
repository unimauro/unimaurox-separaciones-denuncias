// Configuración del repo — cambiar aquí si el repo se mueve.
const REPO_OWNER  = "carlosplaybypoint";
const REPO_NAME   = "unimaurox-separaciones-denuncias";
const REPO_BRANCH = "main";
const REPO_URL    = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
const REPO_BLOB   = `${REPO_URL}/blob/${REPO_BRANCH}`;

// En GitHub Pages los .md no se renderizan — apuntar a github.com para que se vean bonitos.
function reescribirLinksMarkdown() {
  const enGhPages = window.location.hostname.endsWith("github.io");
  if (!enGhPages) return;
  document.querySelectorAll('a[href$=".md"]').forEach(a => {
    const ruta = a.getAttribute("href");
    if (ruta.startsWith("http")) return;
    a.setAttribute("href", `${REPO_BLOB}/${ruta}`);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
}

// Asegura que el navbar y footer apunten al repo configurado.
function inyectarLinksRepo() {
  document.querySelectorAll('[data-repo-link]').forEach(el => {
    const tipo = el.getAttribute("data-repo-link");
    el.href = tipo === "issues" ? `${REPO_URL}/issues` : REPO_URL;
  });
}

// Carga todos los datos en paralelo y monta el dashboard.
async function cargarDatos() {
  const archivos = [
    "data/feminicidios_latam.json",
    "data/homicidios_hombres_latam.json",
    "data/divorcios_latam.json",
    "data/suicidios_sexo_latam.json",
    "data/peru_temporal.json",
    "data/marco_legal.json",
    "data/sources.json"
  ];
  const resp = await Promise.all(archivos.map(a => fetch(a).then(r => r.json())));
  return {
    feminicidios: resp[0],
    homicidios:   resp[1],
    divorcios:    resp[2],
    suicidios:    resp[3],
    peruTemporal: resp[4],
    marcoLegal:   resp[5],
    fuentes:      resp[6]
  };
}

// Render del panel regional.
function renderPanelRegional(data) {
  renderRankingBar(
    "chart-feminicidios",
    ordenarPorTasa(data.feminicidios.paises),
    "Tasa por 100k mujeres",
    COLORS.rojo
  );
  renderRankingBar(
    "chart-homicidios",
    ordenarPorTasa(data.homicidios.paises),
    "Tasa por 100k hombres",
    COLORS.azul
  );
  renderRankingBar(
    "chart-divorcios",
    ordenarPorTasa(data.divorcios.paises),
    "Divorcios por 1,000",
    COLORS.naranja
  );
  renderSuicidioComparado("chart-suicidios", data.suicidios.paises);
}

// Render del panel Perú.
function renderPanelPeru(data) {
  const serieDenuncias  = data.peruTemporal.indicadores_peru.find(i => i.nombre.startsWith("Denuncias"));
  const serieOAF        = data.peruTemporal.indicadores_peru.find(i => i.nombre.startsWith("Población interna"));
  const serieFemPe      = data.peruTemporal.indicadores_peru.find(i => i.nombre.startsWith("Feminicidios"));
  const serieDivPe      = data.peruTemporal.indicadores_peru.find(i => i.nombre.startsWith("Divorcios"));
  const serieArch       = data.peruTemporal.indicadores_peru.find(i => i.nombre.startsWith("Archivamientos"));

  renderSerieTemporal("chart-denuncias",       serieDenuncias.serie, "Denuncias",              COLORS.rojo);
  renderSerieTemporal("chart-oaf",             serieOAF.serie,       "Internos por OAF",       COLORS.azul);
  renderSerieTemporal("chart-feminicidios-pe", serieFemPe.serie,     "Feminicidios",           COLORS.morado);
  renderSerieTemporal("chart-divorcios-pe",    serieDivPe.serie,     "Divorcios inscritos",    COLORS.naranja);
  renderSerieTemporal("chart-archivamientos",  serieArch.serie,      "% archivado",            COLORS.gris);
}

// Render de la tabla de marco legal.
function renderTablaLegal(data) {
  const tbody = document.querySelector("#tabla-legal tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  for (const p of data.marcoLegal.paises) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${p.pais}</strong></td>
      <td>${p.ley_violencia}</td>
      <td>${p.medidas_proteccion_sin_contradictorio}</td>
      <td>${p.prision_por_oaf}</td>
      <td>${p.denuncia_falsa_tipificada}</td>
      <td>${p.tenencia_compartida}</td>
      <td>${p.obstruccion_vinculos}</td>
    `;
    tbody.appendChild(tr);
  }
}

// Render del panel de fuentes.
function renderFuentes(data) {
  const cont = document.getElementById("fuentes-list");
  if (!cont) return;
  const indicadores = data.fuentes.indicadores;
  let html = "<dl class='row small'>";
  for (const [clave, info] of Object.entries(indicadores)) {
    html += `
      <dt class="col-sm-4">${clave.replace(/_/g, " ")}</dt>
      <dd class="col-sm-8">
        <a href="${info.url}" target="_blank" rel="noopener">${info.fuente_primaria}</a><br />
        <em>${info.definicion}</em><br />
        <span class="text-warning">⚠ ${info.advertencias}</span>
      </dd>
    `;
  }
  html += "</dl>";
  cont.innerHTML = html;
}

// Punto de entrada.
(async function () {
  try {
    inyectarLinksRepo();
    reescribirLinksMarkdown();
    const data = await cargarDatos();
    renderPanelRegional(data);
    renderPanelPeru(data);
    renderTablaLegal(data);
    renderFuentes(data);
  } catch (err) {
    console.error("Error cargando datos:", err);
    const main = document.querySelector("main");
    if (main) {
      const div = document.createElement("div");
      div.className = "alert alert-danger";
      div.textContent = "Error al cargar datos. Verificar que los archivos /data/*.json estén accesibles. Detalle en consola.";
      main.prepend(div);
    }
  }
})();
