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
			helper.isPositionCommented
		}
	);
	context.subscriptions.push(disposable);
}

function update(){
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
