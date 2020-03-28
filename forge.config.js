const path = require('path');
module.exports = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'src/assets/icons/icon'),
    asar: true,
    // executableName: "My System Information",
  },
  plugins:
    [
      [
        "@electron-forge/plugin-webpack",
        {
          mainConfig: path.resolve(__dirname, './webpack.main.config.js'),
          renderer: {
            config: path.resolve(__dirname, './webpack.renderer.config.js'),
            entryPoints: [
              {
                html: path.resolve(__dirname, './src/views/main/main.view.html'),
                js: path.resolve(__dirname, './src/views/main/main.view.js'),
                name: "main_window"
              }
            ]
          }
        }
      ]
    ],
  makers: [
    {
      name: "@electron-forge/maker-zip",
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "my-system-information",
        loadingGif: path.resolve(__dirname, 'src/assets/gif/installing.gif'),
      }
    },
    // {
    //   name: '@electron-forge/maker-wix',
    //   config: {
    //     exe: "my-system-information-setup",
    //     language: 1033,
    //     manufacturer: 'Jecsham NRC'
    //   }
    // }
  ],
  publisher: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          name: 'my-system-information'
        },
        prerelease: false
      }
    }
  ]
}