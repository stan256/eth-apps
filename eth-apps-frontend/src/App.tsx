import React from 'react';
import './App.scss';
import EthAppsCatalog from "./EthAppsCatalog";
import {Route, Routes} from "react-router-dom";
import VotingApp from "./eth-apps/voting-app";
import Layout from "./layout/Layout";
import Homepage from "./pages/Homepage";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Homepage/>}/>
                    <Route path="eth-apps-catalog" element={<EthAppsCatalog/>}/>
                    <Route path="voting-app" element={<VotingApp/>}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
