import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import MuiGitHubIcon from '@mui/icons-material/GitHub';
import MuiTwitterIcon from '@mui/icons-material/Twitter';

function GitHubIcon() {
    return <MuiGitHubIcon sx={{ fontSize: '1rem' }} />;
}

function TwitterIcon() {
    return <MuiTwitterIcon sx={{ fontSize: '1rem' }} />;
}

function DiscordIcon() {
    return (
        <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: '1rem' }}>
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </SvgIcon>
    );
}

function BlueskyIcon() {
    return (
        <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: '1rem' }}>
            <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
        </SvgIcon>
    );
}

function MastodonIcon() {
    return (
        <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: '1rem' }}>
            <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" />
        </SvgIcon>
    );
}

const socialLinks = [
    { href: 'https://github.com/lbkulinski/cta4j-api', icon: <GitHubIcon />, label: 'GitHub' },
    { href: 'https://x.com/cta4j', icon: <TwitterIcon />, label: 'Twitter' },
    { href: 'https://bsky.app/profile/cta4j.com', icon: <BlueskyIcon />, label: 'Bluesky' },
    { href: 'https://mastodon.social/@ctasmokers', icon: <MastodonIcon />, label: 'Mastodon' },
    { href: 'https://discord.gg/gNWjXZAhge', icon: <DiscordIcon />, label: 'Discord' },
];

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#111111',
                borderTop: '1px solid #222222',
                paddingBottom: 'env(safe-area-inset-bottom)',
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                <Box sx={{ display: 'flex', gap: 3, minWidth: 0 }}>
                    <Link
                        href="https://ctasmokers.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: '#999999', fontSize: '0.75rem', fontWeight: 500, '&:hover': { color: '#aaaaaa' } }}
                    >
                        ctasmokers.com
                    </Link>
                    <Link
                        href="https://buymeacoffee.com/cta4j"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ color: '#999999', fontSize: '0.75rem', fontWeight: 500, '&:hover': { color: '#aaaaaa' } }}
                    >
                        Buy Me a Coffee
                    </Link>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    {socialLinks.map(({ href, icon, label }) => (
                        <Link
                            key={href}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            underline="none"
                            sx={{
                                color: '#999999',
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': { color: '#aaaaaa' },
                            }}
                        >
                            {icon}
                        </Link>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;
