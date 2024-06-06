import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataCleanerApp } from './components/DataCleanerApp';
import { ModelApp } from './components/ModelApp';


const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DataCleanerApp/>} />
          <Route  path='/model' element={<ModelApp/>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
