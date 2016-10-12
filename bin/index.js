#!/usr/bin/env node

/**
 * Module dependencies
 */
const https = require('https');
const child = require('child_process');
const fs = require('fs');
const omfg = require('commander');
const colors = require('colors');


/**
 * App
 */
omfg
	.version('0.0.1')
	.usage('<directory> [<options>]')
	.option('-h, --help', 'Display help information')
	.option('-v, --version', 'Output OMFG version')
	.option('-l, --license <opt>', 'Set license')
	.option('-i, --ignore <opt>', 'Set .gitignore')
	.option('-c, --ci <opt>', 'Set continue')
	.option('--no-template', 'Disallow .github templates')
	.option('--no-editor', 'Disallow .editorconfig')
	.option('--no-readme', 'Disallow readme.md')
	.option('--no-license', 'Disallow readme.md')
	.option('--no-ignore', 'Disallow readme.md')
	.parse(process.argv);


/**
 * Statements
 */
 // Verificate Node cmd
if (process.argv[0].match(/node/i)) var repository = process.argv[2];
else var repository = process.argv[1];
// Define source path
const source = {
	hostname: `raw.githubusercontent.com`,
	path: '/cjpatoilo/omfg/master/src',
};
// Help information
const info = `
  Usage:

    $ omfg <directory> [<options>]

  Options:

    -h, --help              Display help information
    -v, --version           Output OMFG version
    -l, --license           Set license
    -i, --ignore            Set .gitignore
    -c, --ci                Set continue
    --no-template           Disallow .github templates
    --no-editor             Disallow .editorconfig
    --no-readme             Disallow readme.md
    --no-license            Disallow readme.md
    --no-ignore             Disallow readme.md

  Examples:

    $ omfg
    $ omfg help
    $ omfg --version

  Default when no arguments:

    $ omfg <directory> --license mit --ignore node --ci travis
`;


console.log(omfg._args);

return


/**
 * Help information
 */
if (!omfg.help) {
	console.log(info);
	return;
}


/**
 * Without any parameters
 */
if (!process.argv.slice(2).length) {
	console.log(info.red);
	return;
}


/**
 * Without directory
 */
if (repository.indexOf('--') !== -1) {
	console.log(`\n[ERROR] Set the directory name:\n\n   $ omfg <directory> [<options>]\n`.red);
	return;
}


/**
 * Create directory
 */
if (repository) {
	child.exec(`mkdir ${repository}`);
}



/**
 * Create readme.md
 */
if (repository) {
	let url = {
		hostname: `${source.hostname}`,
		path: `${source.path}/readme/readme.md`,
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/readme.md`, response);
			});
		});
}


/**
 * Create license
 */
if (typeof omfg.license === 'string') {
	let url = {
		hostname: `${source.hostname}`,
		path: `${source.path}/licenses/${omfg.license}`,
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/license`, response);
			});
		});
}
else {
	let url = {
		hostname: `${source.hostname}`,
		path: `${source.path}/licenses/mit`,
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/license`, response);
			});
		});
}


/**
 * Create .gitignore
 */
if (typeof omfg.ignore === 'string') {
	let url = {
		hostname: `www.gitignore.io`,
		path: `/api/${omfg.ignore}`,
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/.gitignore`, response);
			});
		});
}
else {
	let url = {
		hostname: `www.gitignore.io`,
		path: `/api/node`,
	};
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/.gitignore`, response);
			});
		});
}


/**
 * Create GitHub Template
 */
if (!omfg.template) {
	let url = `${repository}/.github`;
	child.exec(`mkdir ${url}`)
	child.exec(`touch ${url}/contributing ${url}/issue_template ${url}/pull_request_template`)
}
