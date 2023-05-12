import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import App from './App';
import {createStore, Store} from "redux";
import {DispatchType, LayersAction, LayersState} from "./components/map/reducers/type";
import reducer from "./components/map/reducers/reducer";
import {Provider} from "react-redux";

const store: Store<LayersState, LayersAction> & {
    dispath: DispatchType
} = createStore(reducer)

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);
reportWebVitals();
