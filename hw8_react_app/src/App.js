import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom'

import NavbarComponent from './components/navbar/NavbarComponent'

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
    </BrowserRouter>
  )
}

export default App;
