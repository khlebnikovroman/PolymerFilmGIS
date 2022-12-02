import React from 'react';
import './App.css';
import MapComponent from "./components/map/Map";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ContextMenuProvider} from "./components/context";
import {Login2} from "./components/Login/login.component";
import {RequireAuth} from "./RequireAuth";
import {LogoutComponent} from "./components/Login/logout.component";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <RequireAuth>
                        <ContextMenuProvider>
                            <div className="App">
                                <MapComponent/>
                            </div>
                        </ContextMenuProvider>
                    </RequireAuth>
                }/>
                <Route path="/about" element={<h1>ABOUT</h1>}/>
                <Route path="/login" element={<Login2/>}/>
                <Route path="/logout" element={<LogoutComponent/>}/>
            </Routes>
        </BrowserRouter>

    );
}

export default App;
