const config = {
    verbose: true,
    transform: {
        '\\.[jt]sx?$': 'babel-jest',
      },
      moduleNameMapper: {
        "\\.css$": "identity-obj-proxy",
      },
  };
  
  module.exports = config;
