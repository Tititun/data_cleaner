import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataCleanerApp } from './components/DataCleanerApp';


const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DataCleanerApp/>} />
          <Route  path='/model' element={<div>My model!</div>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
    
);
