const vscode = require('vscode');

class helper {

    /**
     * @description shows a dialog message
     */
    static logTest() {
        vscode.window.showInformationMessage('Hello World from multichar-blockscope-highlighter!');
    }

    /**
     * @param {vscode.Position} "p" the position in question
     * @param {String} "start" the chosen start string/bracket
     * @param {String} "end" the chosen end string/bracket 
     * @returns {vscode.Range} range between start/end brackets
     */
    static getScope(p, start, end){

    }

    /**
     * @param {vscode.TextDocument} "d" the active document
     * @param {vscode.Position} "p" the position to be checked
     * @returns {boolean} whether or not the position is commented
     */
    static isPositionCommented(d, p) {
        let line = d.lineAt(p.line);
        if (line.text.trim().startsWith('//')){
            return true;
        } 

        let offset = d.offsetAt(p);
        let text = d.getText();

        let cmtStartOffset = text.lastIndexOf('/*', offset - 1); 
        let cmtEndOffset = text.lastIndexOf('*/', offset - 1);

        if (cmtStartOffset > cmtEndOffset) { // > : after
            return true;
        }
        
        return false;
    }
}

module.exports = helper;