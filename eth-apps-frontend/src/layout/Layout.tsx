import React from 'react';
import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import {Backdrop, CircularProgress, Container} from "@mui/material";

export interface LayoutState {
    backdrop: boolean
}


function Layout() {
    const [outletContext, setOutletContext] = React.useState<LayoutState>({
        backdrop: false
    });

    return (
        <>
            <Navbar/>

            <Container maxWidth='lg' sx={{mt: 2}}>
                <Outlet context={setOutletContext}/>
            </Container>

            <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={outletContext.backdrop}>
                <CircularProgress color="inherit"/>
            </Backdrop>

        </>
    );
}


export default Layout;
