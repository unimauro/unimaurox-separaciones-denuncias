// Paleta accesible (Okabe-Ito).
const COLORS = {
  azul:   "#0072B2",
  rojo:   "#D55E00",
  verde:  "#009E73",
  amarillo:"#F0E442",
  naranja:"#E69F00",
  morado: "#CC79A7",
  cielo:  "#56B4E9",
  gris:   "#999999"
};

// Ordenar datos descendente por una propiedad numérica.
function ordenarPorTasa(arr, campo = "tasa") {
  return [...arr].sort((a, b) => (b[campo] || 0) - (a[campo] || 0));
}

// Render de barra horizontal genérica para ranking de países.
function renderRankingBar(canvasId, datosOrdenados, etiqueta, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: datosOrdenados.map(d => d.pais),
      datasets: [{
        label: etiqueta,
        data: datosOrdenados.map(d => d.tasa),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
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
            label: ctx => `${ctx.parsed.x} (${datosOrdenados[ctx.dataIndex].anio || ""})`
          }
        }
      },
      scales: {
        x: { beginAtZero: true, ticks: { font: { size: 11 } } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

// Render de barra comparada hombres vs mujeres (suicidios).
function renderSuicidioComparado(canvasId, datos) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const ordenado = [...datos].sort((a, b) => b.tasa_hombres - a.tasa_hombres);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ordenado.map(d => d.pais),
      datasets: [
        {
          label: "Hombres",
          data: ordenado.map(d => d.tasa_hombres),
          backgroundColor: COLORS.azul
        },
        {
          label: "Mujeres",
          data: ordenado.map(d => d.tasa_mujeres),
          backgroundColor: COLORS.morado
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
      scales: {
        x: { beginAtZero: true, ticks: { font: { size: 11 } } },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

// Render de línea temporal genérica.
function renderSerieTemporal(canvasId, serie, etiqueta, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: serie.map(d => d.anio),
      datasets: [{
        label: etiqueta,
        data: serie.map(d => d.valor),
        borderColor: color,
        backgroundColor: color + "33",
        tension: 0.25,
        fill: true,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}
