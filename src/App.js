import { useEffect, useRef, useState } from 'react';
import { Grid, Button } from '@mui/material';
import UsbIcon from '@mui/icons-material/Usb';
import './App.css';

function App() {
    let [sentence, setSentence] = useState('');
    const [paired, setPaired] = useState(false);
    const word = useRef(null);

    useEffect(() => {
        if (word.current) word.current.focus();
    }, []);

    const getDeviceData = async () => {
        const devices = await navigator.hid.requestDevice({
            filters: [{ vendorId: 1984, productId: 4410 }]
        });

        if (devices.length > 0) {
            setPaired(true);

            if (!devices[0].opened) {
                try {
                    let openingDevice = await devices[0].open();

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

    return (
        <>
            <header className="App-header"></header>
            <main>
                <div className="title-wrapper">
                    <h1>Hello talk</h1>
                    <p>La communication alternative améliorée</p>
                    {!paired && (
                        <Button variant="contained" startIcon={<UsbIcon />} onClick={getDeviceData} tabIndex={-1}>
                            Connecter le dispositif
                        </Button>
                    )}
                </div>
                <div className="main-content">
                    <p>{sentence}</p>
                </div>
            </main>
        </>
    );
}

export default App;
