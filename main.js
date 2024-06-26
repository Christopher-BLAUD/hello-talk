const { app, BrowserWindow, Tray, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

try {
    require('electron-reloader')(module);
} catch {}

let mainWindow;

let appIcon = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1450,
        minWidth: 1350,
        maxWidth: 1920,
        height: 800,
        minHeight: 800,
        maxHeight: 1080,
        backgroundColor: '#2C3144',
        autoHideMenuBar: true,
        icon: path.join(__dirname, '/src/assets/icons/favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    });

    let grantedDeviceThroughPermHandler;

    mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
        mainWindow.webContents.session.on('hid-device-added', (event, device) => {
            console.log('hid-device-added FIRED WITH', device);
            mainWindow.webContents.send('device-added', 'added');
        });

        mainWindow.webContents.session.on('hid-device-removed', (event, device) => {
            console.log('hid-device-removed FIRED WITH', device);
            mainWindow.webContents.send('device-removed', 'removed');
        });

        event.preventDefault();

        if (details.deviceList && details.deviceList.length > 0) {
            const deviceToReturn = details.deviceList.find((device) => {
                return device.vendorId === 1984 && device.productId === 4410;
            });
            if (deviceToReturn) {
                callback(deviceToReturn.deviceId);
            } else {
                callback();
            }
        }
    });

    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
        if (details.deviceType === 'hid' && details.origin === 'file://') {
            if (!grantedDeviceThroughPermHandler) {
                grantedDeviceThroughPermHandler = details.device;
                return true;
            } else {
                return false;
            }
        }
    });

    mainWindow.loadURL(`${app.getAppPath()}\\build\\index.html`);
};

app.whenReady().then(() => {
    createWindow();
    appIcon = new Tray('/src/assets/icons/favicon.ico');
    app.on('activate', () => (BrowserWindow.getAllWindows().length === 0 ? createWindow() : ''));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('move-file', (event, filePath) => {
    const destinationPath = path.join(__dirname, 'sounds', path.basename(filePath));

    fs.copyFile(filePath, destinationPath, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Succés !');
        }
    });
});
