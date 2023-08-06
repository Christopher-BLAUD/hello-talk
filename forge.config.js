const path = require('path')

module.exports = {
    packagerConfig: {
        asar: true,
        icon: path.join(__dirname, '/src/assets/icons/favicon.ico')
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                icon: path.join(__dirname, '/src/assets/icons/favicon.ico'),
                setupIcon: path.join(__dirname, '/src/assets/icons/favicon.ico')
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin']
        },
        {
            name: '@electron-forge/maker-deb',
            config: {}
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {}
        }
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {}
        }
    ]
};
