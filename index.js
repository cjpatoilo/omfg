#!/usr/bin/env node

/**
 * Module dependencies.
 */
const https = require('https'),
	child = require('child_process'),
	fs = require('fs'),
	omfg = require('commander'),
	colors = require('colors');



/**
 * Statements.
 */
omfg
	.version('0.0.1')
	.usage('[<options> ...]')
	.option('-r, --repository <opt>', 'set the repository name')
	.option('-l, --license <opt>', 'choose the license')
	.option('-i, --ignore <opts>', 'set useful .gitignore files')
	.option('--github', 'use GitHub templates')
	.on('--help', () => {
		console.log('  Examples:');
		console.log('');
		console.log('    $ omfg');
		console.log('    $ omfg --license mit');
		console.log('    $ omfg --gitignore node');
		console.log('');
	})
	.parse(process.argv);


/**
 * Statements.
 */
const SOURCE = '/cjpatoilo/omfg/master/src',
	REPOSITORY = omfg.repository,
	LICENSE = omfg.license,
	IGNORE = omfg.ignore,
	GITHUB = omfg.github;


/**
 * Create directory.
 */
if (!REPOSITORY) {
	console.log('set the repository name');
	return;
}
child.exec(`mkdir ${REPOSITORY}`)


/**
 * Create readme.md.
 */
if (REPOSITORY) {
	let url = {
		host: 'raw.githubusercontent.com',
		path: `${SOURCE}/readme/readme.md`
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${REPOSITORY}/readme.md`, response);
			});
		});
}


/**
 * Create license.
 */
if (LICENSE) {
	let url = {
		host: 'raw.githubusercontent.com',
		path: `${SOURCE}/licenses/${LICENSE}`
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${REPOSITORY}/license`, response);
			});
		});
}


/**
 * Create .gitignore.
 */
if (IGNORE) {
	let url = {
		host: 'www.gitignore.io',
		path: `/api/${IGNORE}`,
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${REPOSITORY}/.gitignore`, response);
			});
		});
}


/**
 * Create GitHub Template.
 */
if (GITHUB) {
	let path = `${REPOSITORY}/.github`;
	child.exec(`mkdir ${path}`)
	child.exec(`touch ${path}/contributing.md ${path}/issue_template.md ${path}/pull_request_template.md`)
}
