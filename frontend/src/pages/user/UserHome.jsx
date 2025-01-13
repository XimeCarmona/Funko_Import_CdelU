import React, { useState } from 'react';
import Header from '../../components/user/Header';
import GridFunkos from '../../components/user/GridFunkos';
import Footer from '../../components/user/Footer';

function UserHome() {
  const [searchTerm, setSearchTerm] = useState('');  // Estado de búsqueda

  return (
    <div>
      <Header setSearchTerm={setSearchTerm} />  {/* Pasamos la función de búsqueda */}
      <GridFunkos searchTerm={searchTerm} />     {/* Pasamos el término de búsqueda */}
      <Footer />
    </div>
  );
}

export default UserHome;