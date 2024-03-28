const {functions, delimeters} = require('./helper');
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
			functions.logTest(vscode.window.activeTextEditor);
		}
		);
		context.subscriptions.push(disposable);
		functions.loadDelimeters();
		//functions.paintMyShit(vscode.window.activeTextEditor); //this breaks it

		// vscode.window.onDidChangeTextEditorSelection(update);
		// vscode.workspace.onDidChangeTextDocument(update); 
		// vscode.workspace.onDidChangeConfiguration(functions.loadDelimeters);
}

function update(){
	//requires that delimeters have been read
	//functions.paintMyShit(vscode.window.activeTextEditor); //this breaks it
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
