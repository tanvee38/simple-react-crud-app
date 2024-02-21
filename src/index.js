import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navbar, Footer} from './components/layout';
import { Home } from './components/home';
import { Products } from './components/products';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={ <Home/> } />
      <Route path="/products" element={ <Products/> } />
    </Routes>
    <Footer />
    </BrowserRouter>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);