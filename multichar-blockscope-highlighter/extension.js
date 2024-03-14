// import {helper} from './helper';
const helper = require('./helper');
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// proof of life command (see package.json "commands")
	
	let disposable = vscode.commands.registerCommand(
		'multichar-blockscope-highlighter.proofOfLife', 
		function () {
			helper.logTest();
		}
	);
	context.subscriptions.push(disposable);
}

function update(){
	/**
	 * update is called when something changes
	 * scan backward for first start/bracket
	 * keep a list of the sequence of start/end delimiters encountered
	 */
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	let delimeters = helper.loadDelimeters();
	
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
