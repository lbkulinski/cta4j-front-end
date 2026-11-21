import {Box} from '@mui/material';
import {keyframes} from '@mui/material/styles';

const fall = keyframes`
    from { transform: translate3d(0, -5vh, 0); }
    50% { transform: translate3d(24px, 50vh, 0); }
    to { transform: translate3d(-12px, 105vh, 0); }
`;

const flakes = Array.from({length: 36}, (_, i) => ({
    left: (i * 37) % 100,
    size: 3 + (i % 3) * 2,
    duration: 9 + ((i * 7) % 10),
    delay: -((i * 5) % 14),
    opacity: 0.35 + (i % 4) * 0.15,
}));

function Snow() {
    return (
        <Box
            aria-hidden="true"
            sx={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
                '@media (prefers-reduced-motion: reduce)': {display: 'none'},
            }}
        >
            {flakes.map((flake, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: `${flake.left}%`,
                        width: flake.size,
                        height: flake.size,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        opacity: flake.opacity,
                        animation: `${fall} ${flake.duration}s linear ${flake.delay}s infinite`,
                    }}
                />
            ))}
        </Box>
    );
}

export default Snow;
