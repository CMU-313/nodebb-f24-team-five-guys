'use strict';

module.exports = {
	include: ['src/**/*.js'], // Files to include for analysis
	exclude: ['node_modules/**', 'tests/**'], // Exclude test files or unnecessary paths
	events: ['call', 'return'], // Specify events to intercept (e.g., function calls, returns)
	plugins: {
		runtimeVisualization: true, // Enable runtime visualization
	},
};
