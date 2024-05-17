const {functions, delimeters, log} = require('./helper');
const vscode = require('vscode');

function activate(context) {

	// process to register the proof of life command (see package.json "commands")
	let POLcommand = vscode.commands.registerCommand(
		'multichar-blockscope-highlighter.proofOfLife', 
		function () {
			functions.logTest(vscode.window.activeTextEditor);
		}
	);
	context.subscriptions.push(POLcommand);
	functions.loadDelimeters();
	log.appendLine("Extension has been activated.");
		
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
