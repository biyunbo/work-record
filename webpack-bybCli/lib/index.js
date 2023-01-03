const webpack = require('webpack');

let compiler;
try {
    compiler = webpack(options);
} catch (err) {
    if (err.name === "WebpackOptionsValidationError") {
        if (argv.color) console.error(`\u001b[1m\u001b[31m${err.message}\u001b[39m\u001b[22m`);
        else console.error(err.message);
        process.exit(1);
    }
    throw err;
}


