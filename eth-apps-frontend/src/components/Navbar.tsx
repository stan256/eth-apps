import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";

export default function Navbar() {
    return (
        <Box>
            <AppBar component="nav" position="static">
                <Toolbar>
                    <IconButton color="inherit">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h5"
                                component="span"
                                sx={{flexGrow: 1}}>
                        Stanislavs Test Applications
                        <Link to={'/'}>Home</Link>
                        <Link to={'/eth-apps-catalog'}>Eth Apps catalog</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
