import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { SpeechContext } from '../../utils/Context/SpeechContext';
import UsbIcon from '@mui/icons-material/Usb';
import logo from '../../assets/img/logo-eq.svg';
import styles from './Home.module.css';

function Home() {
    const { paired, setPaired, setConnected } = useContext(SpeechContext);
    const navigate = useNavigate();

    const getDevicesPermission = async () => {
        const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 1984, productId: 4410 }] });
        if (devices.length > 0) {
            setPaired(true);
            setConnected(true);
            navigate('/app');
        }
    };

    return (
        <>
            <header className="App-header"></header>
            <main className={styles.mainContent}>
                <div className={styles.titleWrapper}>
                    <div className={styles.title}>
                        <h1 className={styles.titleH1}>
                            Hello talk <img src={logo} alt='logo de hello talk'/>
                        </h1>
                        <p className={styles.titleP}>
                            L’application de communication alternative améliorée. Communiquez sans barrière, soyez
                            entendu et soyez inspiré.
                        </p>
                        {!paired && (
                            <Button
                                variant="contained"
                                startIcon={<UsbIcon />}
                                onClick={getDevicesPermission}
                                tabIndex={-1}
                                className={styles.titleButton}
                            >
                                Connecter le controlleur
                            </Button>
                        )}
                    </div>
                </div>
                <div className={styles.backgroundImg}></div>
            </main>
        </>
    );
}

export default Home;
