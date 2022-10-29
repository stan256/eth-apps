import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {ConfigOptions} from '@web3modal/core'
import {Web3Modal} from '@web3modal/react'
import {chains, providers} from '@web3modal/ethereum'

const themeOptions = createTheme({
    palette: {
        primary: {
            main: '#0e3dff',
        },
        secondary: {
            main: '#dcb520',
        },
        text: {
            primary: '#000000',
            secondary: 'rgba(37,47,37,0.54)',
        },
    },
})

const config: ConfigOptions = {
    projectId: process.env.REACT_APP_WALLET_ID!,
    theme: 'light',
    accentColor: 'blue',
    ethereum: {
        appName: 'web3Modal',
        chains: [chains.mainnet, chains.goerli, chains.hardhat, chains.localhost],
        providers: [providers.walletConnectProvider({ projectId: process.env.REACT_APP_WALLET_ID! })]
    }
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Web3Modal config={config}/>
        <ThemeProvider theme={themeOptions}>
            <CssBaseline/>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
