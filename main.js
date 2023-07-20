const { app, BrowserWindow } = require('electron');
const path = require('path');

try {
    require('electron-reloader')(module);
} catch {}

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    let grantedDeviceThroughPermHandler;

    mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
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

    mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
        if (permission === 'hid' && details.securityOrigin === 'file:///') {
            return true;
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
    app.on('activate', () => (BrowserWindow.getAllWindows().length === 0 ? createWindow() : ''));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
