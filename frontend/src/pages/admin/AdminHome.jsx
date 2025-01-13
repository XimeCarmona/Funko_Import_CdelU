import React from 'react';
import '../../Admin.css'

function AdminHome() {
  return (
    <div className="home-container">
      <div className="row">
        <div className="card blue">Ventas Totales</div>
        <div className="card green">Productos Activos</div>
        <div className="card yellow">Clientes Activos</div>
      </div>
      <div className="row">
        <div className="card purple">Productos Más Vendidos</div>
        <div className="card red">Clientes Recientes</div>
      </div>
    </div>
  );
}

export default AdminHome;

// import React from 'react';
// import '../App.css';

// function Home() {
//   return (
//     <div className="home-container">
//       <div className="row">
//         <div className="card blue">
//           <h3>Ventas Totales</h3>
//           <p>$26.553,89</p>
//         </div>
//         <div className="card green">
//           <h3>Productos Activos</h3>
//           <p>+80</p>
//         </div>
//         <div className="card yellow">
//           <h3>Clientes Activos</h3>
//           <p>+500</p>
//         </div>
//       </div>
//       <div className="row">
//         <div className="card purple">
//           <h3>Productos Más Vendidos</h3>
//           <ul>
//             <li>Nombre: Funko Pop Spiderman</li>
//             <li>Colección: Marvel</li>
//             <li>Ventas: 1.200 unidades</li>
//           </ul>
//         </div>
//         <div className="card red">
//           <h3>Clientes Recientes</h3>
//           <ul>
//             <li>Nombre: Juan Pérez Fecha: 25/12/2024</li>
//           </ul>
//           <ul>
//             <li>Nombre: Laura Gómez Fecha: 27/12/2024</li>
//           </ul>
//           <ul>
//             <li>Nombre: Ximena Carmona Fecha: 27/12/2024</li>
//           </ul>
//           <ul>
//             <li>Nombre: Thomas Carotta Fecha: 27/12/2024</li>
//           </ul>
//           <ul>
//             <li>Nombre: Axel Schenfeld Fecha: 27/12/2024</li>
//           </ul>
//           <ul>
//             <li>Nombre: Victoria Valenzuela Fecha: 27/12/2024</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;
