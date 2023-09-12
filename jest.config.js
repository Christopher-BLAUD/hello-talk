const config = {
    verbose: true,
    transform: {
        '\\.[jt]sx?$': 'babel-jest',
      },
      moduleNameMapper: {
        "\\.css$": "identity-obj-proxy",
        '^dexie$': require.resolve("dexie")
      }
  };
  
  module.exports = config;
