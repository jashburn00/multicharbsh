var helper = require('./helper');
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// register proof of life command (see package.json "commands")
	let disposable = vscode.commands.registerCommand(
		'multichar-blockscope-highlighter.proofOfLife', 
		function () {
			helper.functions.logTest();
		}
		);
		context.subscriptions.push(disposable);
		
		helper.functions.loadDelimeters();
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
	
	
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
