import React from 'react';
import EthAppsCatalog from "./pages/EthAppsCatalog";
import {Route, Routes} from "react-router-dom";
import VotingApp from "./eth-apps/VotingApp";
import Layout from "./layout/Layout";
import Homepage from "./pages/Homepage";
import Box from "@mui/material/Box";

function App() {
    return (
        <Box className="App">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Homepage/>}/>
                    <Route path="eth-apps-catalog" element={<EthAppsCatalog/>}/>
                    <Route path="voting-app" element={<VotingApp/>}/>
                </Route>
            </Routes>
        </Box>
    );
}

export default App;
