import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-blue-800 text-white flex justify-between items-center p-4">
      <div className="about">
    <p>Acerca de nosotros</p>
    <p>Somos una empresa que inició en 2024 y se</p>
    <p>dedica a la importación y venta de Funko pops.</p>
    </div>

    <div className="contact text-right">
    <p>Contacto</p>

    <p>Teléfono: +54 3442 400500</p>
    <p>Email: contacto@mitienda.com</p>
    </div>
    </footer>

  );
};

export default Footer;