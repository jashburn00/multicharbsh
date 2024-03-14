const vscode = require('vscode');
const delimeters = {
    "startDelimeter": "poop",
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
        vscode.window.showInformationMessage('start delimeter: '+delimeters.startDelimeter);
    }

    /**
     * @return {NULL, NULL} will return null if ur not gay
     * @return {vscode.Position} will return null if ur gay
     */
    // https://vshaxe.github.io/vscode-extern/vscode/TextDocument.html
    static scanDocumentForScope(){
        const editor = vscode.window.activeTextEditor;
        const cursor_pos = editor.selection.active;
        let scan_pos = cursor_pos;

        let nesting_level = 0;
        let scope_beginning, scope_end;

        if (cursor_pos) {
            /**
             * If we are in a non-global scope and also in the current most narrow scope, then scanning left and incrementing/decrementing
             * a token by the rules below will ensure that any scanning over any other scope and returning to the current scope will
             * result in the token returning to the value it started with, in this case 0. Therefore, the first starting delimiter we hit
             * that increments the token up to 1 must be the start of the narrowest possible scope.
             * 
             * // if we start at the beginning of the file then we are necessarily in the global scope (so not in any narrower scope)
             * while scan_pos is not at the beginning of the file
             *      
             *      // check the left character and adjust the nesting level as required
             *      if the character to the left is the starting delimiter
             *          add 1 to the nesting level
             *          if the nesting level equals 1
             *              update the scope beginning position to the scan_pos
             *              break out of the loop
             *      else if the character to the left is the ending delimiter
             *          subtract 1 from the nesting level
             * 
             *      scan_pos = decrementCursor(scan_pos)
             *      
             * 
             * scope_beginning = scan_pos
             * if scope_beginning points to the beginning of the file
             *      return {"scope_start_pos": NULL, "scope_end_pos": NULL}
             *      
             * 
             * // now we know we are in something's scope, so we just reverse the previous while loop to scan right and find the closing bracket
             * 
             * scan_pos = cursor_pos // reset the scan_pos to the cursor_pos
             * 
             * while scan_pos is not at the end of the file
             * 
             *      // check the right character and adjust the nesting level as required
             *      if the character to the left is the starting delimiter
             *          add 1 to the nesting level
             *          if the nesting level equals 0
             *              break out of the loop
             *      else if the character to the left is the ending delimiter
             *          subtract 1 from the nesting level
             * 
             *      scan_pos = decrementCursor(scan_pos)
             * 
             * scope_end = scan_pos
             * // note that if the scope is closed then the loop above must necessarily break, so if this if statement fires then we should
             * // either do nothing or throw an error
             * if scope_end points to the end of the file
             *      throw an error, or alternatively,
             *      return {"scope_start_pos": NULL, "scope_end_pos": NULL}
             * 
             * return {"scope_start_pos": scope_beginning, "scope_end_pos": scope_end}
             */
        }
        // while ()
        
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
        let config = vscode.workspace.getConfiguration('multicharbsh configs', vscode.workspace.workspaceFolders[0].uri);
        //oralsexdemon!
        // https://stackoverflow.com/questions/44151691/vscode-is-there-an-api-for-accessing-config-values-from-a-vscode-extension
        return {
            "startDelimeter": config.get('multichar-blockscope-highlighter.startDelimeter'),
            "endDelimeter": config.get('multichar-blockscope-highlighter.endDelimeter'),
            "singleLineComment": config.get('multichar-blockscope-highlighter.singleLineComment'),
            "multilineCommentStart": config.get('multichar-blockscope-highlighter.multiLineCommentStart'),
            "multilineCommentEnd": config.get('multichar-blockscope-highlighter.multiLineCommentEnd')
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