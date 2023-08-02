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
import CategoryIcon from '@mui/icons-material/Category';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Overview from '../../components/Overview/Overview';
import { useState } from 'react';

function Dashboard() {
    const [open, setOpen] = useState(false);
    const [isOverview, setIsOverview] = useState(true)

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <h1 className={styles.headerTitle}>
                    <img src={logo} alt="logo de hello talk" /> Hello Talk
                </h1>
                <nav className={styles.navBar}>
                    <List sx={{ minWidth: '330px' }}>
                        <ListItemButton className={styles.navItem}>
                            <Link onClick={() => setIsOverview(true)}>
                                <ListItemIcon className={styles.iconContainer}>
                                    <HomeOutlinedIcon className={styles.navIcon} />
                                </ListItemIcon>
                                <ListItemText primary="Tableau de bord" className={styles.navText} />
                            </Link>
                        </ListItemButton>
                        <ListItemButton className={styles.navItem}>
                            <Link to={'/app'}>
                                <ListItemIcon className={styles.iconContainer}>
                                    <AppsOutlinedIcon className={styles.navIcon} />
                                </ListItemIcon>
                                <ListItemText primary="Application" className={styles.navText} />
                            </Link>
                        </ListItemButton>
                        <ListItemButton className={`${styles.navItem} ${styles.subMenuHeading}`} onClick={handleClick}>
                            <ListItemIcon className={styles.iconContainer}>
                                <AddCircleOutlineOutlinedIcon className={styles.navIcon} />
                            </ListItemIcon>
                            <ListItemText primary="Ajouter un élement" className={styles.navText} />
                            {open ? <ExpandLess className={styles.navIcon} /> : <ExpandMore className={styles.navIcon} />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="ul">
                                <ListItemButton className={styles.navItem} sx={{ pl: 4 }}>
                                    <Link onClick={() => setIsOverview(false)}>
                                        <ListItemIcon className={styles.iconContainer}>
                                            <CategoryIcon className={styles.navIcon} />
                                        </ListItemIcon>
                                        <ListItemText primary="Nouvelle catégorie" className={styles.navText} />
                                    </Link>
                                </ListItemButton>
                                <ListItemButton className={styles.navItem} sx={{ pl: 4 }}>
                                    <Link to={'add-word'} onClick={() => setIsOverview(false)}> 
                                        <ListItemIcon className={styles.iconContainer}>
                                            <DriveFileRenameOutlineIcon className={styles.navIcon} />
                                        </ListItemIcon>
                                        <ListItemText primary="Nouveau mot" className={styles.navText} />
                                    </Link>
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List>
                </nav>
            </header>
            <main className={styles.content}>
                {isOverview ? <Overview/> : <Outlet/>}
            </main>
        </div>
    );
}

export default Dashboard;
