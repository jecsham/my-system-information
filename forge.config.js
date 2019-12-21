const path = require('path');
module.exports = {
  packagerConfig: {
      icon: path.resolve(__dirname, 'src/assets/icons/icon'),
      asar: true,
      executableName: "My System Information"
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
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "my_system_information"
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: [
        "darwin"
      ]
    },
    {
      name: "@electron-forge/maker-deb",
      config: {}
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {}
    }
  ]
}