import React from 'react';
import MuiToolbar from '@mui/material/Toolbar';
import { AppBar, Typography } from '@mui/material';

function Navbar() {
    return (
        <AppBar position="sticky">
            <MuiToolbar>
                <Typography variant="h6">
                    Light Demo
                </Typography>
            </MuiToolbar>
        </AppBar>
    );
}

export default Navbar;