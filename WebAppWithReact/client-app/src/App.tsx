import React from 'react';
import './App.css';
import MapComponent from "./components/map";
import {ContextMenuProvider} from "./components/context";

function App() {
  return (
      <ContextMenuProvider>
          <div className="App">
              <MapComponent/>
          </div>
      </ContextMenuProvider>
  );
}

export default App;
