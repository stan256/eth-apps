import React from 'react';
import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";

function Layout() {
    return (
        <>
            <Navbar />


            <Outlet/>

            <footer>
                bla 2022 bla
            </footer>
        </>
    );
}

export default Layout;
