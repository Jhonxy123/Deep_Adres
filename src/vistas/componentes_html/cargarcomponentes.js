
async function cargarComponente(selector, ruta) {
  try {
    const respuesta = await fetch(ruta);
    const contenido = await respuesta.text();
    document.querySelector(selector).innerHTML = contenido;
  } catch (error) {
    console.error(`Error al cargar ${ruta}:`, error);
  }
}