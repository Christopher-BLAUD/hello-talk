import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import UsbIcon from '@mui/icons-material/Usb';
import logo from '../../assets/img/logo-eq.svg';
import styles from './Home.module.css';

function Home() {
    let [sentence, setSentence] = useState('');
    const [paired, setPaired] = useState(false);
    const [connected, setConnected] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // window.electronAPI.handleDeviceAdded((event, value) => {
        //     if (value === 'added') {
        //         setConnected(true);
        //         getDeviceData();
        //     }
        // });
        // window.electronAPI.handleDeviceRemoved((event, value) => {
        //     if (value === 'removed') {
        //         setConnected(false);
        //     }
        // });
        getDeviceData();
    }, [paired, connected]);

    const getDeviceData = async () => {
        const devices = await navigator.hid.getDevices();
        if (devices.length > 0) {
            if (devices[0].vendorId === 1984 && devices[0].productId === 4410 && !devices[0].opened) {
                try {
                    let openingDevice = await devices[0].open();
                    setPaired(true);
                    devices[0].addEventListener('inputreport', (event) => {
                        const { data } = event;
                        const pressedPad = data.getUint8(2);

                        switch (pressedPad) {
                            case 32:
                                setSentence((sentence += 'Christopher.'));
                                break;
                            case 16:
                                setSentence((sentence += "je m'appelle "));
                                break;
                            case 8:
                                setSentence((sentence += 'Bonjour '));
                                break;
                            case 4:
                                setSentence((sentence = ''));
                                break;
                            default:
                                break;
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

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
                            Hello talk <img src={logo} />
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
                                Appairer le controlleur
                            </Button>
                        )}
                    </div>
                    <div className="content">
                        {!connected && (
                            <p>
                                <UsbIcon /> Connecter votre controlleur pour accéder à l'application
                            </p>
                        )}
                        <p>{sentence}</p>
                    </div>
                </div>
                <div className={styles.backgroundImg}></div>
            </main>
        </>
    );
}

export default Home;
