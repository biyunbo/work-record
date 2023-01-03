const yargs = require("yargs");
yargs.parse(process.argv, (err, argv, output) => {
    const stdout = argv.silent ? { write: () => {} } : process.stdout;
    console.log(process.cwd(),'argv');
});
