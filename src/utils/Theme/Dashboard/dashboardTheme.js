import { createTheme } from '@mui/material';

export const dashboardTheme = createTheme({
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    padding: '0',
                    '& a': {
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        padding: '16px 24px',
                        textDecoration: 'none;'
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#fcde9c36',
                        borderRight: '2px solid #fcde9c'
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: '#fcde9c36',
                        borderRight: '2px solid #fcde9c'
                    },
                    '&.Mui-selected .MuiTypography-root': {
                        color: '#fcde9c'
                    },
                    '&.Mui-selected .MuiSvgIcon-root': {
                        fill: '#fcde9c'
                    },
                    '&:hover': {
                        backgroundColor: '#fcde9c36',
                        borderRight: '2px solid var(--yellow-primary)'
                    }
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'Satoshi',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '0.9',
                    color: 'var(--grey-light)',
                    transition: 'all 100ms linear'
                }
            }
        },
        MuiPopper: {
            styleOverrides: {
                root: {
                    '& .MuiTooltip-tooltip': {
                        backgroundColor: 'var(--blue-background)',
                        padding: '8px 16px',
                        fontFamily: 'DM sans',
                        fontWeight: '400',
                        fontSize: '12px',
                        color: '#fff',
                        '& span': {
                            '&::before': {
                                color: 'var(--blue-background)'
                            }
                        }
                    }
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--blue)',
                    '& svg': {
                        fill: 'var(--grey-light)!important',
                        height: '18px'
                    }
                }
            }
        }
    }
});
