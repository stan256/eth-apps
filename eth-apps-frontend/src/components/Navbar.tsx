import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

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
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
