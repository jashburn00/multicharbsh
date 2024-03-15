const vscode = require('vscode');
const delimeters = {
    "startDelimeter": "",
    "endDelimeter": "",
    "singleLineComment": "",
    "multilineCommentStart": "",
    "multilineCommentEnd": ""
} //TODO: as of now, these walues ^ are what show up in the Proof of Life test command

class helper {

    /**
     * @description shows a dialog message
     */
    static logTest() {
        this.loadDelimeters();
        vscode.window.showInformationMessage('start bracket: '+delimeters.startDelimeter);
        this.checkIfBoundedByDelim('testicleft', 'testicright');
    }

    /**
     * @return {NULL, NULL} will return null if ur not gay
     * @return {vscode.Position} will return null if ur gay
     */
    // https://vshaxe.github.io/vscode-extern/vscode/TextDocument.html
    static checkIfBoundedByDelim(start_delim, end_delim){
        // get active text editor and cursor position
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const document = editor.document;
        const cursor_pos = editor.selection.active;

        // get all the text from the beginning of the file to the cursor position, and then
        // get the text from the cursor position to the end of the file
        const left_text = document.getText(new vscode.Range(new vscode.Position(0, 0), cursor_pos));
        const right_text = document.getText(new vscode.Range(cursor_pos, document.positionAt(document.getText().length)));
        
        const left_text_first_delim = left_text.lastIndexOf(start_delim);
        const left_text_last_delim = left_text.IndexOf(start_delim);
        
        const right_text_first_delim = right_text.lastIndexOf(end_delim);
        const right_text_last_delim = right_text.indexOf(end_delim);

        

    }

    /**
     * Given a cursor position, returns a cursor set to the end of that line
     * @param {vscode.Position}
     * @returns {vscode.Position}
     */
    static setCursorToEndOfLine(pos){
        
    }

    /**
     * Given a cursor position, returns a cursor set to the start of that line
     * @param {vscode.Position}
     * @returns {vscode.Position}
     */
    static setCursorToStartOfLine(pos){

    }

    /**
     * Given a cursor position, decrements the character position by one or, if at the start of the line, move the cursor
     * to the end of the next line. If at the beginning of the file, does nothing.
     * @param {vscode.Position}
     * @returns {vscode.Position}
     */
    static decrementCursor(pos){
        
    }
    
    /** 
     * @returns {String} the start delimeter string
     * @returns {String} the end delimeter string
     */
    // static loadDelimeters() {
    //     return vscode.workspace.getConfiguration().get<String>('multichar-blockscope-highlighter.startDelimeter');
    // }
    static loadDelimeters() {
        // let config = vscode.workspace.getConfiguration('multicharbsh configs', vscode.workspace.workspaceFolders[0].uri);
        //oralsexdemon!
        // https://stackoverflow.com/questions/44151691/vscode-is-there-an-api-for-accessing-config-values-from-a-vscode-extension
        let contributions = vscode.workspace.getConfiguration('multichar-blockscope-highlighter');
        //vscode.window.showInformationMessage('start delimeter: '+contributions.get('startDelimeter'));
        return {
            startDelimeter: contributions.get('startDelimeter'),
            endDelimeter: contributions.get('endDelimeter'),
            singleLineComment: contributions.get('singleLineComment'),
            multilineCommentStart: contributions.get('multiLineCommentStart'),
            multilineCommentEnd: contributions.get('multiLineCommentEnd')
        };
    }

    /**
     * @param {vscode.Position} "p" the position in question
     * @param {String} "start" the chosen start string/bracket
     * @param {String} "end" the chosen end string/bracket 
     * @returns {vscode.Range} range between start/end brackets
     */
    static getScope(p, start, end){
        var num = 5;
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

module.exports = helper, delimeters;

//lksjdfksdjfsdf
/*l



I do not associate with niggers

*/