const path = require('path');

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            '/messages': {
                target: 'http://localhost:1234'
            }
        }
    }
}