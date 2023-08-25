import { createTheme } from '@mui/material';

export const appModal = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                root: {
                    '& .MuiPaper-root': { backgroundColor: '#3c435d', minWidth: '400px' }
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    fontFamily: 'DM sans',
                    fontWeight: '700',
                    padding: '24px 32px',
                    backgroundColor: 'var(--blue)'
                }
            }
        },
        MuiList: {
            styleOverrides: {
                root: {
                    padding: '32px 0',
                    overflow: 'auto'
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    padding: '0'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    '&:focus': { backgroundColor: 'rgba(252, 222, 156, 0.21)' }
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    padding: '8px 32px',
                    '& .MuiTypography-root': { fontFamily: 'Satoshi', fontWeight: '400', color: 'var(--grey-light)' }
                }
            }
        }
    }
});
