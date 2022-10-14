import React from 'react';
import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import {Backdrop, CircularProgress} from "@mui/material";

export interface LayoutState {
    backdrop: boolean
}


function Layout() {
    const [outletContext, setOutletContext]: [LayoutState, ((value: (((prevState: LayoutState) => LayoutState) | LayoutState)) => void)] = React.useState<LayoutState>({
        backdrop: false
    });

    return (
        <>
            <Navbar/>

            <Outlet context={setOutletContext}/>

            <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={outletContext.backdrop}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <footer>
                bla 2022 bla
            </footer>
        </>
    );
}


export default Layout;
