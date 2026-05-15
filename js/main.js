// Configuración del repo — cambiar aquí si el repo se mueve.
const REPO_OWNER  = "unimauro";
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
    "data/sources.json",
    "data/violencia_separacion_comparado.json",
    "data/hombres_victimas.json"
  ];
  const resp = await Promise.all(archivos.map(a => fetch(a).then(r => r.json())));
  return {
    feminicidios: resp[0],
    homicidios:   resp[1],
    divorcios:    resp[2],
    suicidios:    resp[3],
    peruTemporal: resp[4],
    marcoLegal:   resp[5],
    fuentes:      resp[6],
    separacion:   resp[7],
    hombres:      resp[8]
  };
}

// Render del strip de KPIs.
function renderKpiStrip(data) {
  const cont = document.getElementById("kpi-strip");
  if (!cont) return;

  const denunciasPeru = data.peruTemporal.indicadores_peru
    .find(i => i.nombre.startsWith("Denuncias")).serie.slice(-1)[0];
  const oafPeru = data.peruTemporal.indicadores_peru
    .find(i => i.nombre.startsWith("Población interna")).serie.slice(-1)[0];
  const femPeru = data.peruTemporal.indicadores_peru
    .find(i => i.nombre.startsWith("Feminicidios")).serie.slice(-1)[0];

  const femMaxPais = [...data.feminicidios.paises].sort((a,b)=>b.tasa-a.tasa)[0];
  const homMaxPais = [...data.homicidios.paises].sort((a,b)=>b.tasa-a.tasa)[0];

  const cards = [
    {
      label: "Denuncias Ley 30364",
      value: denunciasPeru.valor.toLocaleString("es-PE"),
      unit:  "Perú " + denunciasPeru.anio,
      sub:   "Ministerio Público",
      accent: "rojo"
    },
    {
      label: "Presos por OAF",
      value: oafPeru.valor.toLocaleString("es-PE"),
      unit:  "Perú " + oafPeru.anio,
      sub:   "INPE — Art. 149 CP",
      accent: "ambar"
    },
    {
      label: "Feminicidios consumados",
      value: femPeru.valor,
      unit:  "Perú " + femPeru.anio,
      sub:   "MIMP — Programa AURORA",
      accent: "morado"
    },
    {
      label: "Tasa feminicidio (más alta Latam)",
      value: femMaxPais.tasa.toFixed(1),
      unit:  "por 100k mujeres",
      sub:   femMaxPais.pais + " — CEPAL " + femMaxPais.anio,
      accent: "rosa"
    },
    {
      label: "Tasa homicidios hombres (más alta)",
      value: homMaxPais.tasa.toFixed(0),
      unit:  "por 100k",
      sub:   homMaxPais.pais + " — UNODC " + homMaxPais.anio,
      accent: ""
    },
    {
      label: "Países en el comparado",
      value: data.feminicidios.paises.length,
      unit:  "Latam",
      sub:   "CEPAL OIG cobertura",
      accent: "verde"
    }
  ];

  cont.innerHTML = cards.map(c => `
    <div class="kpi-card ${c.accent ? 'accent-' + c.accent : ''}">
      <div class="kpi-label">${c.label}</div>
      <div class="kpi-value">${c.value}<span class="kpi-unit">${c.unit}</span></div>
      <div class="kpi-sub">${c.sub}</div>
    </div>
  `).join("");
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

// Render del panel "Violencia en separación".
function renderPanelSeparacion(data) {
  const sep = data.separacion;

  // Chart 1: % de denuncias en contexto de separación
  const ctxPct = document.getElementById("chart-separacion-pct");
  if (ctxPct) {
    const paises = sep.denuncias_contexto_separacion.paises;
    const ordenado = [...paises].sort((a, b) => b.porcentaje - a.porcentaje);
    new Chart(ctxPct, {
      type: "bar",
      data: {
        labels: ordenado.map(p => p.pais),
        datasets: [{
          label: "% víctimas no convivientes",
          data: ordenado.map(p => p.porcentaje),
          backgroundColor: COLORS.rojo
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => `${c.parsed.x}% (${ordenado[c.dataIndex].anio})`,
              afterLabel: c => ordenado[c.dataIndex].nota
            }
          }
        },
        scales: { x: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } } }
      }
    });
  }

  // Chart 2: Distribución por tipo en Argentina
  const ctxArg = document.getElementById("chart-tipos-argentina");
  if (ctxArg) {
    const valores = sep.distribucion_argentina_detalle.valores;
    const ordenado = [...valores].sort((a, b) => b.porcentaje - a.porcentaje);
    new Chart(ctxArg, {
      type: "bar",
      data: {
        labels: ordenado.map(v => v.tipo),
        datasets: [{
          label: "% de casos",
          data: ordenado.map(v => v.porcentaje),
          backgroundColor: COLORS.morado
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } } }
      }
    });
  }

  // Tabla: tipos tipificados por país
  const tbodyTipos = document.querySelector("#tabla-tipos tbody");
  if (tbodyTipos) {
    tbodyTipos.innerHTML = "";
    for (const fila of sep.tipos_violencia_tipificados.matriz) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${fila.tipo}</strong></td>
        <td>${fila.espana}</td>
        <td>${fila.usa}</td>
        <td>${fila.argentina}</td>
        <td>${fila.brasil}</td>
        <td class="small text-muted">${fila.notas}</td>
      `;
      tbodyTipos.appendChild(tr);
    }
  }

  // Tabla: denuncias falsas oficiales
  const tbodyFalsas = document.querySelector("#tabla-falsas tbody");
  if (tbodyFalsas) {
    tbodyFalsas.innerHTML = "";
    for (const p of sep.denuncias_falsas_oficiales.paises) {
      const pct = p.porcentaje_estimado === null ? "Sin cifra oficial" : `~${p.porcentaje_estimado}%`;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${p.pais}</strong></td>
        <td>${p.fuente}</td>
        <td>${pct}</td>
        <td class="small">${p.descripcion}</td>
      `;
      tbodyFalsas.appendChild(tr);
    }
  }
}

// Render del panel "Hombres víctimas".
function renderPanelHombres(data) {
  const h = data.hombres;

  // Helper para charts comparativos hombre/mujer.
  function renderCompMH(canvasId, valores, etiquetaX = "%") {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: valores.map(v => v.categoria),
        datasets: [
          {
            label: "Mujeres",
            data: valores.map(v => v.mujeres),
            backgroundColor: COLORS.morado
          },
          {
            label: "Hombres",
            data: valores.map(v => v.hombres),
            backgroundColor: COLORS.azul
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.x}${etiquetaX}` } }
        },
        scales: {
          x: { beginAtZero: true, ticks: { callback: v => v + etiquetaX } },
          y: { ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  renderCompMH("chart-nisvs",  h.prevalencia_global_nisvs.valores, "%");
  renderCompMH("chart-ons",    h.ons_uk.valores, "%");
  renderCompMH("chart-abs",    h.abs_australia.valores, "%");
  renderCompMH("chart-archer", h.asimetria_lesiones_archer.valores, "%");

  // Tabla Perú CEM.
  const tbodyPe = document.querySelector("#tabla-peru-cem tbody");
  if (tbodyPe) {
    tbodyPe.innerHTML = h.peru_cem.valores.map(v =>
      `<tr><td>${v.categoria}</td><td><strong>${v.porcentaje}%</strong></td></tr>`
    ).join("");
  }

  // Tabla España CGPJ.
  const tbodyEs = document.querySelector("#tabla-espana-cgpj tbody");
  if (tbodyEs) {
    tbodyEs.innerHTML = h.espana_violencia_domestica.valores.map(v =>
      `<tr><td>${v.categoria}</td><td><strong>${v.porcentaje}%</strong></td></tr>`
    ).join("");
  }

  // Lista "lo que no se mide".
  const lista = document.getElementById("lista-no-medido");
  if (lista) {
    lista.innerHTML = h.lo_que_no_existe.puntos.map(p => `<li>${p}</li>`).join("");
  }
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
    renderKpiStrip(data);
    renderPanelRegional(data);
    renderPanelPeru(data);
    renderPanelSeparacion(data);
    renderPanelHombres(data);
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
