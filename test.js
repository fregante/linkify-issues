import test from 'ava';
import jsdom from 'jsdom';
import {linkifyIssuesToHtml, linkifyIssuesToDom} from './index.js';

const dom = new jsdom.JSDOM();
globalThis.window = dom.window;
globalThis.document = dom.window.document;

// Get DOM node from HTML
const domify = html => document.createRange().createContextualFragment(html);

// Get HTML from DOM node
const html = dom => {
	const element = document.createElement('div');
	element.append(dom);
	return element.innerHTML;
};

test('main', t => {
	t.is(
		linkifyIssuesToHtml('Fixes #143 and avajs/ava#1023', {user: 'sindresorhus', repository: 'dofle'}),
		'Fixes <a href="https://github.com/sindresorhus/dofle/issues/143">#143</a> and <a href="https://github.com/avajs/ava/issues/1023">avajs/ava#1023</a>',
	);
});

test('escapes user input', t => {
	t.is(
		linkifyIssuesToHtml('See #1', {
			user: '<script></script>',
			repository: 'x',
			attributes: {
				class: '<script></script>',
			},
		}),
		'See <a href="https://github.com/&lt;script&gt;&lt;/script&gt;/x/issues/1" class="&lt;script&gt;&lt;/script&gt;">#1</a>',
	);
});

test('attributes option', t => {
	t.is(
		linkifyIssuesToHtml('See avajs/ava#1023', {
			user: 'x',
			repository: 'x',
			attributes: {
				class: 'unicorn',
				target: '_blank',
			},
		}),
		'See <a href="https://github.com/avajs/ava/issues/1023" class="unicorn" target="_blank">avajs/ava#1023</a>',
	);
});

test('baseUrl option', t => {
	t.is(
		linkifyIssuesToHtml('Fixes avajs/ava#1023', {
			user: 'x',
			repository: 'x',
			baseUrl: '',
		}),
		'Fixes <a href="/avajs/ava/issues/1023">avajs/ava#1023</a>',
	);
});

test('DocumentFragment support', t => {
	t.is(
		html(linkifyIssuesToDom('See #1', {
			user: '<script></script>',
			repository: 'x',
			baseUrl: '',
			attributes: {
				class: '<script></script>',
			},
		})),
		html(domify('See <a href="/&lt;script&gt;&lt;/script&gt;/x/issues/1" class="&lt;script&gt;&lt;/script&gt;">#1</a>')),
	);
	t.is(
		html(linkifyIssuesToDom('See #1 for more info', {user: 'sindresorhus', repository: 'linkify-issues', type: 'dom'})),
		html(domify('See <a href="https://github.com/sindresorhus/linkify-issues/issues/1">#1</a> for more info')),
	);
	t.is(
		html(linkifyIssuesToDom('#1 fixes refined-github/refined-github#6930', {user: 'sindresorhus', repository: 'linkify-issues', type: 'dom'})),
		html(domify('<a href="https://github.com/sindresorhus/linkify-issues/issues/1">#1</a> fixes <a href="https://github.com/refined-github/refined-github/issues/6930">refined-github/refined-github#6930</a>')),
	);
});
