import React from 'react';
import EthAppsCatalog from "./pages/EthAppsCatalog";
import {Navigate, Route, Routes} from "react-router-dom";
import VotingApp from "./eth-apps/VotingApp";
import Layout from "./layout/Layout";
import Box from "@mui/material/Box";
import DAOApp from "./eth-apps/DAO";

function App() {
    return (
        <Box className="App">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Navigate to="/eth-apps-catalog" />}/>
                    <Route path="eth-apps-catalog" element={<EthAppsCatalog/>}/>
                    <Route path="voting-app" element={<VotingApp/>}/>
                    <Route path="dao" element={<DAOApp/>}/>
                </Route>
            </Routes>
        </Box>
    );
}

export default App;
