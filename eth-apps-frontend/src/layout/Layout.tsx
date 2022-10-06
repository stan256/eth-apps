import React from 'react';
import {Link, Outlet} from "react-router-dom";

function Layout() {
    return (
        <>
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
