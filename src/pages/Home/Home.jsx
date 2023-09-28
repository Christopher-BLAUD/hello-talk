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
                       <img src={logo} alt="logo de marius system" /> Marius system 
                    </h1>
                    <p className={styles.titleP}>
                    The augmented and alternative communication application. Communicate without barriers, be heard and be inspired.
                    </p>
                    {!connected && (
                        <div className={styles.buttonsContainer}>
                            <Button variant="contained" onClick={connectToDevice} tabIndex={-1} className={styles.titleButton}>
                                Run Application
                            </Button>
                            <Button variant="outlined" className={styles.titleButtonOutlined} onClick={() => navigate('/dashboard')}>
                                Go to dashboard
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;
