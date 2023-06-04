import React from 'react';
import './App.css';
import MapComponent from "./components/map/Map";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ContextMenuProvider} from "./components/context";
import {RequireAuth} from "./RequireAuth";
import {LogoutComponent} from "./components/Auth/Login/logout.component";
import Login from "./components/Auth/Login/Login";
import NotFound from "./components/misc/NotFound";

// {MultilineChart} from "./heatmap/testCountour";
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
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<LogoutComponent/>}/>
                <Route path="*" element={<NotFound/>}/>
                {/*<Route path="/test" element={<MultilineChart/>}/>*/}
            </Routes>
        </BrowserRouter>

    );
}

export default App;
