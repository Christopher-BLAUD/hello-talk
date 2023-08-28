import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { AppContext } from '../../utils/Context/AppContext';
import logo from '../../assets/img/logo-gradient.svg';
import styles from './Home.module.css';

function Home() {
    const { connected, setConnected, setMyController } = useContext(AppContext);
    const navigate = useNavigate();

    const connectToDevice = async () => {
            const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 1984, productId: 4410 }] });
            if (devices.length > 0) {
                setConnected(true);
                setMyController(devices[0]);
                navigate('/app');
            }
    };

    return (
        <div className="wrapper">
            <header className="App-header"></header>
            <main className={styles.mainContent}>
                <div className={styles.title}>
                    <h1 className={styles.titleH1}>
                        Marius system <img src={logo} alt="logo de marius system" />
                    </h1>
                    <p className={styles.titleP}>
                        L’application de communication augmentée et alternative. Communiquez sans barrière, soyez entendu et soyez inspiré.
                    </p>
                    {!connected && (
                        <div className={styles.buttonsContainer}>
                            <Button variant="contained" onClick={connectToDevice} tabIndex={-1} className={styles.titleButton}>
                                Lancer l'application
                            </Button>
                            <Button variant="outlined" className={styles.titleButtonOutlined} onClick={() => navigate('/dashboard')}>
                                Accéder au tableau de bord
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;
