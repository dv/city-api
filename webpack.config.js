module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: [{loader: 'raw-loader', options: {}}]
      }
    ]
  }
}
