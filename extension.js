const {functions, delimiters, log} = require('./helper');
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

	let disposableUpdaterCursor = vscode.window.onDidChangeTextEditorSelection(update);
	let disposableUpdaterInactive = vscode.window.onDidChangeWindowState(handleWindowChange);
	
	context.subscriptions.push(disposableUpdaterCursor);
	context.subscriptions.push(disposableUpdaterInactive);
	context.subscriptions.push(POLcommand);
	functions.loaddelimiters();
	log.appendLine("Extension has been activated.");
}

function update(){
	if(vscode.window.activeTextEditor.selection != selection){
		selection = vscode.window.activeTextEditor.selection;
		functions.logTest(vscode.window.activeTextEditor);
	}
}

function handleWindowChange(){
	if(vscode.window.state.focused == false){ //if the window is no longer selected, either:
		if(delimiters.highlightInactive == true){ //handle highlightInactive on
			return; //we leave the highlight on
		} else { //or handle highlightInactive off
			functions.clearHighlights(vscode.window.activeTextEditor);
		}
	} else { //or if the window is now active... 
		//clear the existing highlight and render a new highlight from the cursor position 
		functions.clearHighlights(vscode.window.activeTextEditor);
		functions.logTest(vscode.window.activeTextEditor);
	}
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
