'use strict';
const issueRegex = require('issue-regex');
const escapeGoat = require('escape-goat');

module.exports = (input, options) => {
	options = Object.assign({
		attributes: {}
	}, options);

	if (!(options.user && options.repo)) {
		throw new Error('Missing required `user` and `repo` options');
	}

	let attributes = Object.keys(options.attributes).map(key => {
		const value = options.attributes[key];
		return `${escapeGoat.escape(key)}="${escapeGoat.escape(value)}"`;
	});
	attributes = attributes.length > 0 ? ' ' + attributes.join(' ') : '';

	const user = escapeGoat.escape(options.user);
	const repo = escapeGoat.escape(options.repo);

	return input.replace(issueRegex(), match => {
		let url;
		if (match.includes('/')) {
			const parts = match.split('#');
			url = `https://github.com/${parts[0]}/issues/${parts[1]}`;
		} else {
			url = `https://github.com/${user}/${repo}/issues/${match.slice(1)}`;
		}

		return `<a href="${url}"${attributes}>${match}</a>`;
	});
};