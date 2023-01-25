import React from 'react';
import { Button, Typography } from '@mui/material';

export default function Choose() {

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Connected Friends
            </Typography>
            <br></br>
            <br></br>
            <Button
                color="secondary"
                variant="contained"
                size="large"
            >
                    Mighty Pong
            </Button>
            <br></br>
            <br></br>
            <Button
                color="secondary"
                variant="contained"
                size="large"
            >
                    Classic Pong
            </Button>
        </React.Fragment>
    );
}