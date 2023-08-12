import { Link, Outlet } from 'react-router-dom';
import styles from './Dashboard.module.css';
import logo from '../../assets/img/logo-gradient.svg';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Overview from '../../components/Overview/Overview';
import AddWord from '../../components/AddWord/AddWord';
import AddCategory from '../../components/AddCategory/AddCategory';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

function Dashboard() {
    const [open, setOpen] = useState(false);
    const [isOverview, setIsOverview] = useState(true);
    const [ openWordModal, setOpenWordModal ] = useState(false)
    const [ openCategoryModal, setOpenCategoryModal ] = useState(false)

    const selectedTheme = createTheme({
        components: {
            MuiListItemButton: {
                styleOverrides: {
                    root: {
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
                        }
                    }
                }
            }
        }
    });

    const handleClick = () => {
        setOpen(!open);
    };

    const closeWordModal = () => {
        setOpenWordModal(false);
    };

    const closeCategoryModal = () => {
        setOpenCategoryModal(false);
    };

    const setSelected = (path) => {
        return path === window.location.hash ? true : false;
    };

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>
                    <img src={logo} alt="logo de Marius System" /> Marius System
                </h1>
                <nav className={styles.navBar}>
                    <List className={styles.listContainer}>
                        <ThemeProvider theme={selectedTheme}>
                            <ListItemButton className={styles.navItem} selected={setSelected('#/dashboard')} title="Tableau de bord">
                                <Link onClick={() => setIsOverview(true)}>
                                    <ListItemIcon className={styles.iconContainer}>
                                        <HomeOutlinedIcon className={styles.navIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary="Tableau de bord" className={styles.navText} />
                                </Link>
                            </ListItemButton>
                            <ListItemButton className={styles.navItem} selected={setSelected('#/app')} title="Application">
                                <Link to={'/app'}>
                                    <ListItemIcon className={styles.iconContainer}>
                                        <AppsOutlinedIcon className={styles.navIcon} />
                                    </ListItemIcon>
                                    <ListItemText primary="Application" className={styles.navText} />
                                </Link>
                            </ListItemButton>
                            <ListItemButton className={`${styles.navItem} ${styles.subMenuHeading}`} onClick={handleClick} title="Ajouter un élément">
                                <ListItemIcon className={styles.iconContainer}>
                                    <AddCircleOutlineOutlinedIcon className={styles.navIcon} />
                                </ListItemIcon>
                                <ListItemText primary="Ajouter un élement" className={styles.navText} />
                                {open ? <ExpandLess className={styles.navIcon} /> : <ExpandMore className={styles.navIcon} />}
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="ul">
                                    <ListItemButton className={styles.navItem} sx={{ pl: 4 }} title="Ajouter une catégorie">
                                        <Link onClick={() => setOpenCategoryModal(true)}>
                                            <ListItemIcon className={styles.iconContainer}>
                                                <CreateNewFolderOutlinedIcon className={styles.navIcon} />
                                            </ListItemIcon>
                                            <ListItemText primary="Nouvelle catégorie" className={styles.navText} />
                                        </Link>
                                    </ListItemButton>
                                    <ListItemButton
                                        className={styles.navItem}
                                        sx={{ pl: 4 }}
                                        selected={setSelected('#/dashboard/add-word')}
                                        title="Ajouter un mot"
                                    >
                                        <Link onClick={() => setOpenWordModal(true)}>
                                            <ListItemIcon className={styles.iconContainer}>
                                                <DriveFileRenameOutlineIcon className={styles.navIcon} />
                                            </ListItemIcon>
                                            <ListItemText primary="Nouveau mot" className={styles.navText} />
                                        </Link>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </ThemeProvider>
                    </List>
                </nav>
            </header>
            <main className={styles.content}>
                <AddWord onClose={closeWordModal} isOpen={openWordModal}/>
                <AddCategory onClose={closeCategoryModal} isOpen={openCategoryModal}/>
                <Overview />
            </main>
        </div>
    );
}

export default Dashboard;
