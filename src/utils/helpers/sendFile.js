export const sendFile = (source) => {
    window.electronAPI.moveFile(source);
}