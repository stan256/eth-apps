import React from 'react';
import {Link, Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";

function Layout() {
    return (
        <>
            <Navbar />
            <header>
                <Link to={'/'}>Home</Link>
                <Link to={'/eth-apps-catalog'}>Eth Apps catalog</Link>
            </header>

            <Outlet/>

            <footer>
                bla 2022 bla
            </footer>
        </>
    );
}

export default Layout;
