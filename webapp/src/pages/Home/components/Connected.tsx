import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

export default function Connected() {
    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Connected Friends
            </Typography>
            <Typography component="p" variant="h4">
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
            </Typography>
            <div>
                <Link color="primary" href="#" onClick={preventDefault}>
                    <Typography component="p" variant="subtitle1">
                    see all
                    </Typography>
                </Link>
            </div>
        </React.Fragment>
    );
}