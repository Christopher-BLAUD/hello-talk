import { createTheme } from '@mui/material';

export const navbarTheme = createTheme({
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    padding: "0",
                    "& a": {
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        padding: "24px",
                        textDecoration: "none;"
                        
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
                    "&:hover": {
                        backgroundColor: "#fcde9c36",
                        borderRight: "2px solid var(--yellow-primary)"
                    }
                }
            }
        }
    }
});