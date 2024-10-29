'use strict';

// iroh-test.js
const Iroh = require('iroh');

// Sample code to analyze
const code = `
    const groupsPerPage = 10;
    let page = 1;
`;

// Create an Iroh stage and add a listener for variable declarations
const stage = new Iroh.Stage(code);
const listener = stage.addListener(Iroh.VAR);

// Log variable name and value after each creation
listener.on('after', (e) => {
	console.log(e.name, '=>', e.value);
});

// Define and log variables directly to avoid linting issues
(() => {
	const groupsPerPage = 10;
	const page = 1;

	// Log variables to avoid eslint errors
	console.log('groupsPerPage:', groupsPerPage);
	console.log('page:', page);
})();
