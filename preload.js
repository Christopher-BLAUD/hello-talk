const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handleDeviceAdded: (callback) => ipcRenderer.on('device-added', callback),
  handleDeviceRemoved: (callback) => ipcRenderer.on('device-removed', callback)
})