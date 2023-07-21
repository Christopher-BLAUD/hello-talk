import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import UsbIcon from '@mui/icons-material/Usb';
import './style.css';

function Home() {
    let [sentence, setSentence] = useState('');
    const [paired, setPaired] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        window.electronAPI.handleDeviceAdded((event, value) => {
            if (value === 'added') {
                setConnected(true);
                getDeviceData();
            }
        });
        window.electronAPI.handleDeviceRemoved((event, value) => {
            if (value === 'removed') {
                setConnected(false);
            }
        });
        getDeviceData();
    }, [paired, connected]);

    const getDeviceData = async () => {
        const devices = await navigator.hid.getDevices();
        if (devices.length > 0) {
            if (devices[0].vendorId === 1984 && devices[0].productId === 4410 && !devices[0].opened) {
                setConnected(true);
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
        }
    };

    return (
        <>
            <header className="App-header"></header>
            <main className="main-content">
                <div className="title-wrapper">
                    <div className="title">
                        <h1>Hello talk</h1>
                        <p>
                            L’application de communication alternative améliorée. Communiquez sans barrière, soyez
                            entendu et soyez inspiré.
                        </p>
                        {!paired && (
                            <Button
                                variant="contained"
                                startIcon={<UsbIcon />}
                                onClick={getDevicesPermission}
                                tabIndex={-1}
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
                <div className="background-image"></div>
            </main>
        </>
    );
}

export default Home;
