import { createTheme } from "@mui/material";

export const modalTheme = createTheme({
    components: {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    background: '#080910e2'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    gap: '16px',
                    boxShadow: '0px 0px 13px 6px rgba(32, 35, 49, 0.23)',
                    backgroundColor: 'var(--blue-background)',
                    minWidth: '420px',
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--blue-light)"
                    }
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'Satoshi',
                    fontSize: '20px',
                    fontWeight: '300!important',
                    padding: '0!important'
                }
            }
        },
        MuiIcon: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
            }
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--blue)',
                    borderRadius: '4px',
                    color: '#fdedc9',
                    fontWeight: '300',
                    '&::after': {
                        borderColor: 'var(--yellow-primary)'
                    },
                    '&::before': {
                        display: 'none'
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--blue)',
                    color: '#fdedc9',
                    fontWeight: '300',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '0'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #FCDE9C'
                    },
                    '& svg': {
                        fill: '#fdedc9'
                    }
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: '#EBEDF3',
                    fontWeight: '200',
                    fontSize: '14px',
                    fontFamily: 'DM sans',
                    '&.Mui-focused': {
                        color: 'var(--yellow-primary)'
                    }
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: '#EBEDF3'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    border: '1px solid var(--yellow-primary)',
                    textTransform: 'unset',
                    padding: '16px 32px',
                    color: 'var(--yellow-primary)',
                    fontWeight: '300',
                    fontFamily: 'DM sans',
                    '&:hover': {
                        borderColor: 'unset'
                    }
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    '& svg': {
                        fill: 'var(--yellow-primary)'
                    }
                }
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    '& .MuiTypography-root': {
                        color: 'var(--grey-light)',
                        fontSize: '14px',
                        fontWeight: '400!important'
                    },
                    "& .MuiFormControlLabel-asterisk": {
                        color: "#fff"
                    }
                }
            }
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    "& svg": {
                        fill: "#fdedc9"
                    }
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    padding: "8px 0",
                    width: "fit-content"
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    fontFamily: "Satoshi",
                    color: "var(--grey-light)",
                    "& .MuiTypography-root": {
                        fontSize: "14px",
                        fontWeight: "400!important"
                    }
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: "var(--yellow-transparent)",
                    "& svg": {
                        fill: "var(--yellow-primary)"
                    }
                }
            }
        }
    }
});