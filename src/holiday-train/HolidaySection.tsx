import {Alert, Box, CircularProgress, Paper, Typography} from '@mui/material';
import {ReactNode} from 'react';

export interface HolidayRow {
    key: string;
    name: string;
    etaMinutes: number;
    approaching?: boolean;
    scheduled?: boolean;
    delayed?: boolean;
}

interface HolidaySectionProps {
    title: string;
    children: ReactNode;
}

export function HolidaySection({title, children}: HolidaySectionProps) {
    return (
        <Box sx={{p: 1.5}}>
            <Typography variant="h5" component="h2" sx={{fontWeight: 700, color: '#B3000C', mb: 1.5}}>
                {title} 🎅🏻
            </Typography>
            {children}
        </Box>
    );
}

export function HolidayMessage({children}: { children: ReactNode }) {
    return <Alert severity="error">{children}</Alert>;
}

export function HolidayEmpty({vehicle}: { vehicle: string }) {
    return (
        <Paper sx={{backgroundColor: '#171717', border: '1px solid #2a2a2a', borderRadius: 2, overflow: 'hidden'}}>
            <Box sx={candyCane}/>
            <Box sx={{px: 2, py: 3, textAlign: 'center'}}>
                <Typography variant="h4" component="div" aria-hidden="true">❄️</Typography>
                <Typography variant="body1" sx={{color: '#fff', fontWeight: 600, mt: 1}}>
                    The Holiday {vehicle} is in the workshop
                </Typography>
                <Typography variant="body2" sx={{color: 'text.secondary', mt: 0.5}}>
                    It isn't running right now. Check back during the holiday season!
                </Typography>
            </Box>
        </Paper>
    );
}

const candyCane = {
    height: 6,
    background: 'repeating-linear-gradient(135deg, #B3000C 0 8px, #f5f5f5 8px 16px)',
};

interface HolidayCardProps {
    heading: string;
    headerColor: string;
    headerTextColor?: string;
    columnLabel: string;
    rows: HolidayRow[];
    updatedAt: number;
    isFetching: boolean;
}

export function HolidayCard({heading, headerColor, headerTextColor = '#fff', columnLabel, rows, updatedAt, isFetching}: HolidayCardProps) {
    const updated = updatedAt
        ? new Date(updatedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})
        : null;

    return (
        <Box>
            <Paper sx={{backgroundColor: '#171717', border: '1px solid #2a2a2a', borderRadius: 2, overflow: 'hidden'}}>
                <Box sx={candyCane}/>
                <Box sx={{px: 1.5, py: 0.25, backgroundColor: headerColor}}>
                    <Typography variant="body1" sx={{fontWeight: 'bold', color: headerTextColor, letterSpacing: '0.08em'}}>
                        {heading}
                    </Typography>
                </Box>
                <Box component="ul" aria-label={columnLabel} sx={{listStyle: 'none', m: 0, p: 0}}>
                    {rows.map((row, i) => {
                        const label = row.etaMinutes <= 1 ? 'Due' : `${row.scheduled ? '~' : ''}${row.etaMinutes} min`;
                        const color = row.approaching || row.etaMinutes <= 1 ? '#4caf50'
                            : row.delayed ? '#f44336'
                            : row.scheduled ? '#90caf9'
                            : '#e5e5e5';
                        const status = row.approaching ? ', Approaching' : row.delayed ? ', Delayed' : row.scheduled ? ', Scheduled' : '';

                        return (
                            <Box
                                component="li"
                                key={row.key}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    gap: 2,
                                    px: 1.5,
                                    py: 1,
                                    borderTop: i > 0 ? '1px solid #2a2a2a' : undefined,
                                }}
                            >
                                <Typography variant="body2" sx={{color: '#fff'}}>
                                    {row.name}
                                </Typography>
                                <Typography variant="body1" aria-label={`${label}${status}`} sx={{fontWeight: 700, color, whiteSpace: 'nowrap'}}>
                                    {label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Paper>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 0.75}}>
                {isFetching && <CircularProgress size={12} thickness={5} sx={{color: '#555'}} />}
                {updated && (
                    <Typography variant="caption" sx={{color: '#555'}}>
                        Updated {updated}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
