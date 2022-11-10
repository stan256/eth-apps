import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Link as RouterLink} from 'react-router-dom';
import {Link} from '@mui/material';
import {useAccount, useConnectModal, useDisconnect} from "@web3modal/react";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
    const {account: {address, isConnected}} = useAccount()
    const {open} = useConnectModal()
    const disconnect = useDisconnect()

    return (
        <Box>
            <AppBar component="nav" position="static">
                <Toolbar>
                    <IconButton color="inherit">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h5" component="span" sx={{flexGrow: 1}}>
                        <Link component={RouterLink} to='/' color='secondary' underline='none'>Stanislavs Test
                            Applications</Link>

                        {/* User data if logged in */}
                        {
                            isConnected &&
                            <Typography>Address: {address}</Typography>
                        }
                    </Typography>

                    {/* Log in button */}
                    {
                        !isConnected &&
                        <IconButton color="inherit" onClick={_ => open()}>
                            <AccountCircleIcon/>
                        </IconButton>
                    }

                    {/* Log out button */}
                    {
                        isConnected &&
                        <IconButton color="inherit" onClick={disconnect}>
                            <LogoutIcon/>
                        </IconButton>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
