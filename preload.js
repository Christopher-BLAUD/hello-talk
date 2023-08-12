const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handleDeviceAdded: (callback) => ipcRenderer.on('device-added', callback),
  handleDeviceRemoved: (callback) => ipcRenderer.on('device-removed', callback),
  moveFile: (callback) => ipcRenderer.send('move-file', callback)
})