const {functions, delimeters, log} = require('./helper');
const vscode = require('vscode');
var selection = new vscode.Position(0,0);

function activate(context) {

	// process to register the proof of life command (see package.json "commands")
	let POLcommand = vscode.commands.registerCommand(
		'scope-highlighter.proofOfLife', 
		function () {
			functions.logTest(vscode.window.activeTextEditor);
		}
	);

	let disposableUpdate = vscode.window.onDidChangeTextEditorSelection(update);
	
	context.subscriptions.push(disposableUpdate);
	context.subscriptions.push(POLcommand);
	functions.loadDelimeters();
	log.appendLine("Extension has been activated.");
		
	// vscode.window.onDidChangeTextEditorSelection(update);
	// vscode.workspace.onDidChangeTextDocument(update); 
	// vscode.workspace.onDidChangeConfiguration(functions.loadDelimeters);
}

function update(){
	if(vscode.window.activeTextEditor.selection != selection){
		selection = vscode.window.activeTextEditor.selection;
		functions.logTest(vscode.window.activeTextEditor);
	}
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
