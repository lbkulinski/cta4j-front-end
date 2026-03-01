import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function MenuBar() {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#111111', borderBottom: '1px solid #c60c30', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}>
            <Toolbar variant="dense" sx={{ maxWidth: '56rem', width: '100%', mx: 'auto', px: 2 }}>
                <Typography component="a" href="/" sx={{ flexGrow: 1, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#c60c30', textDecoration: 'none', '&:hover': { color: '#e8102e' } }}>
                    cta4j
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Link href="/trains" underline="hover" sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#aaaaaa', '&:hover': { color: '#ffffff' } }}>
                        Trains
                    </Link>
                    <Link href="/buses" underline="hover" sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#aaaaaa', '&:hover': { color: '#ffffff' } }}>
                        Buses
                    </Link>
                    <Link href="mailto:admin@cta4j.app" underline="hover" sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#aaaaaa', '&:hover': { color: '#ffffff' } }}>
                        Contact
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default MenuBar;
