import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#111111',
                borderTop: '1px solid #222222',
            }}
        >
            <Box
                sx={{
                    maxWidth: '56rem',
                    width: '100%',
                    mx: 'auto',
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    gap: 3,
                }}
            >
                <Link
                    href="https://ctasmokers.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: '#666666', fontSize: '0.75rem', fontWeight: 500, '&:hover': { color: '#aaaaaa' } }}
                >
                    ctasmokers.com
                </Link>
                <Link
                    href="https://buymeacoffee.com/cta4j"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: '#666666', fontSize: '0.75rem', fontWeight: 500, '&:hover': { color: '#aaaaaa' } }}
                >
                    Buy Me a Coffee
                </Link>
            </Box>
        </Box>
    );
}

export default Footer;
