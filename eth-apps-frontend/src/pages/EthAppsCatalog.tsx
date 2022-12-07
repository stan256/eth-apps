import React, {FC} from "react";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {List, ListItem, ListItemText} from "@mui/material";

const EthAppsCatalog: FC = () => {
    return <Box>
        <Typography component="h2" align="center" variant="h2">List of projects:</Typography>

        <List sx={{textAlign: 'center'}}>
            <ListItem component={Link} to={'/voting-app'}>
                <ListItemText primary="Voting App" primaryTypographyProps={{variant: 'h4', component: 'h4'}}/>
            </ListItem>
            <ListItem component={Link} to={'/dao'}>
                <ListItemText primary="DAO" primaryTypographyProps={{variant: 'h4', component: 'h4'}}/>
            </ListItem>
        </List>

    </Box>
}

export default EthAppsCatalog
