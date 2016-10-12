#!/usr/bin/env node

/**
 * Module dependencies.
 */
const https = require('https');
const child = require('child_process');
const fs = require('fs');
const omfg = require('commander');
const colors = require('colors');


/**
 * Statements.
 */
omfg
	.version('0.0.1')
	.usage('<directory> [<options>]')
	.option('-h, --help', 'Display help information')
	.option('-v, --version', 'Output OMFG version')
	.option('-l, --license <opt>', 'Choose the license')
	.option('-i, --ignore <opts>', 'Set useful .gitignore files')
	.option('-t, --template', 'Use GitHub templates')
	.parse(process.argv);


/**
 * Statements.
 */
const repository = () => {
	let verification = String(process.argv.slice(2)).indexOf('--') === -1;
	if (verification) return process.argv.slice(2);
	else return false;
};
const source = 'raw.githubusercontent.com/cjpatoilo/omfg/master/src';
const license = omfg.license;
const ignore = omfg.ignore;
const template = omfg.github;
const help = omfg.help;
const info = `
  Usage:

    omfg <command> [<args>] [<options>]

  Commands:

    help                    Display help information about Boeing
    version                 Output Bower version

  Options:

    -h, --help              Display help information about Boeing
    -v, --version           Output Bower version

  Examples:

    omfg
    omfg help
    omfg --version

See 'omfg help <command>' for more information on a specific command.
`;


/**
 * Help information
 */
if (!help) {
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
if (!repository) {
	console.log(`\n[ERROR] Set the repository name:\n\n   $ omfg --repository myApp\n`.red);
	return;
}


/**
 * Create directory.
 */
if (repository) {
	child.exec(`mkdir ${repository}`)
}

console.log('Code is Poetry');
return;


/**
 * Create readme.md.
 */
if (repository) {
	let url = `${source}/readme/readme.md`;
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/readme.md`, response);
			});
		});
}


/**
 * Create license.
 */
if (license) {
	let url = `${source}/licenses/${license}`;
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/license`, response);
			});
		});
}


/**
 * Create .gitignore.
 */
if (ignore) {
	let url = `www.gitignore.io/api/${ignore}`;
	https
		.get(url, (response) => {
			return response.on('data', (response) => {
				return fs.writeFile(`${repository}/.gitignore`, response);
			});
		});
}


/**
 * Create GitHub Template.
 */
if (template) {
	let url = `${repository}/github`;
	child.exec(`mkdir ${url}`)
	child.exec(`touch ${url}/contributing.md ${url}/issue_template.md ${url}/pull_request_template.md`)
}
