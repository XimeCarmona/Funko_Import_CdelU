// export const obtenerFunkos = async () => {
//     const respuesta = await fetch('/funkos.json'); // Ruta local
//     const datos = await respuesta.json();
//     return datos;
//   };
  
//   export const obtenerDetalleFunko = async (id) => {
//     const respuesta = await fetch('/funkos.json');
//     const datos = await respuesta.json();
//     return datos.find((funko) => funko.id === Number(id));
//   };
  
// Obtener todos los Funkos para la grilla
export const obtenerFunkos = async () => {
    const respuesta = await fetch('/funkos.json');  // Ruta local en public/
    const datos = await respuesta.json();
    return datos;
  };
  
  // Obtener detalle de un Funko por ID
  export const obtenerDetalleFunko = async (id) => {
    const respuesta = await fetch('/funkos.json');
    const datos = await respuesta.json();
    return datos.find((funko) => funko.id === Number(id));
  };