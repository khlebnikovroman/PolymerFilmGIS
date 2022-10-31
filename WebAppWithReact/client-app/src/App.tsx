import React from 'react';
import './App.css';
import MapComponent from "./components/map/Map";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ContextMenuProvider, MenuLayersProvider} from "./components/context";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={
                  <ContextMenuProvider>
                      <div className="App">
                              <MapComponent/>
                      </div>
                  </ContextMenuProvider>
              }/>
              <Route path="/about" element={<h1>ABOUT</h1>}/>
          </Routes>
      </BrowserRouter>

  );
}

export default App;
