// tsconfig-paths-bootstrap.js
const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const baseUrl = './src';
const cleanup = tsConfigPaths.register({
	baseUrl,
	paths: tsConfig.compilerOptions.paths,
});

// Lorsque l'application se termine, nettoyez les paths enregistrés
process.on('exit', cleanup);
