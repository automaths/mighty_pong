import { Box } from '@mui/material';
import { AccountProfileDetails } from './components/AccountDetails';
import { AccountProfile } from './components/AccountProfile';

const Account = () => (
    <>
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 8
            }}>
            <AccountProfile />
        </Box>
        <AccountProfileDetails />
    </>
);

export default Account;