const vscode = require('vscode');
var delimeters = { //these values get overwritten by user input; this is just in case the default settings don't get applied
    "startDelimeter": "{",
    "endDelimeter": "}",
    "singleLineComment": "//",
    "multilineCommentStart": "/*",
    "multilineCommentEnd": "*/",
    "red": 100,
    "green": 40,
    "blue": 80,
    "alpha": 0.4
} 

class functions {

    /**
     * @description used by the Proof of Life command to test shit
     */
    static logTest() {
        //vscode.window.showInformationMessage('red: '+delimeters.red); //this works
        vscode.window.showInformationMessage(this.checkIfBoundedByDelim(',', '.'));
        //this.checkIfBoundedByDelim('testicleft', 'testicright'); //this causes an error currently
    }

    /**
     * @param {String} start delimeter
     * @param {String} end delimeter
     * @return {vscode.Range} returns null if no valid range was found
     */
    // https://vshaxe.github.io/vscode-extern/vscode/TextDocument.html
    static getRangeUsingDelimeters(start_delim, end_delim){
        // get active text editor and cursor position
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return null;
        }
        const document = editor.document;
        const cursor_pos = editor.selection.active;

        // Loop over the left of the cursor to find where the first open start delim is
        let scan_pos = cursor_pos;
        let count = 0;
        
        //scan backward
        while (scan_pos){

            let start_delim_range = new vscode.Range(scan_pos.translate(0, -start_delim.length), scan_pos);
            let end_delim_range = new vscode.Range(scan_pos.translate(0, -end_delim.length), scan_pos);

            // Check the character at the current position, increment the count if it's the start delim, decrement if it's the end delim
            // startDelim -> +1  endDelim -> -1  count = 1 -> found it
            if (document.getText(start_delim_range) == start_delim){
                if(!this.isPositionCommented(document, scan_pos)){
                    count++;
                }
                if (count == 1){
                    break;
                }
            }
            else if (document.getText(end_delim_range) == end_delim){
                if(!this.isPositionCommented(document, scan_pos)){
                    count--;
                }
            }
            // decrement the scan position
            scan_pos = this.decrementCursor(scan_pos, document);
        }

        if (!scan_pos){
            return null;
        }

        const left_delim_pos = scan_pos;
        
        scan_pos = cursor_pos;
        count = 0;

        //scan forward
        while(scan_pos){
            //create range using current position
            let start_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, start_delim.length));
            let end_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, end_delim.length));
            
            //check if we found the delimeter
            if(document.getText(start_delim_range) == start_delim){
                if(!this.isPositionCommented(document, scan_pos)){
                    count++;
                }
            }
            if(document.getText(end_delim_range) == end_delim){
                if(!this.isPositionCommented(document, scan_pos)){
                    count--;
                }
                if(count == -1){
                    break; 
                }
            }

            scan_pos = this.incrementCursor(scan_pos, document);
        }

        if (!scan_pos){
            return null;
        }

        const right_delim_pos = scan_pos;

        return new vscode.Range(left_delim_pos, right_delim_pos); //this is the region that must get painted
    }

    /**
     * @param {vscode.Position} pos: the position to decrement
     * @returns {vscode.Position} the decremented position, or null if the cursor is at the beginning of the file
     */
    static decrementCursor(pos, doc){
        
        let new_pos;
        if (pos.character > 0){
            new_pos = vscode.Position(pos.line, pos.character - 1);
            return new_pos
        }
        else if (pos.line > 0){
            let new_line = doc.lineAt(pos.line - 1);
            new_pos = vscode.Position(pos.line - 1, new_line.text.length);
            return new_pos;
        }
        else {
            // character and line are always nonnegative, so this branch means pos.character == 0 and pos.line == 0
            // so we are at the beginning of the file
            return new_pos;
        }
    }

    /**
     * @param {vscode.Position} pos: the position to increment
     * @returns {vscode.Position} the incremented position, or null if increment not possible
     */
    static incrementCursor(pos, doc){
        let lastPosition = doc.lineAt(doc.lineCount - 1).range.end;
        if (pos.isEqual(lastPosition)){
            //if last position already
            return; 
        }
        else {
            if(pos.character == doc.lineAt(pos.line).text.length){
                //if last character in a line
                return new vscode.Position(pos.line+1, 0);
            } else{
                // otherwise it can increment normally
                return new vscode.Position(pos.line, pos.character+1);
            }
        }
    }
    
    /** 
     * @description reads user settings into 'delimeters' variable
     */
    static loadDelimeters() {
        //oralsexdemon!
        // https://stackoverflow.com/questions/44151691/vscode-is-there-an-api-for-accessing-config-values-from-a-vscode-extension
        let contributions = vscode.workspace.getConfiguration('multichar-blockscope-highlighter');
        
        delimeters = {
            startDelimeter: contributions.get('startDelimeter'),
            endDelimeter: contributions.get('endDelimeter'),
            singleLineComment: contributions.get('singleLineComment'),
            multilineCommentStart: contributions.get('multiLineCommentStart'),
            multilineCommentEnd: contributions.get('multiLineCommentEnd'),
            red: contributions.get('red'),
            green: contributions.get('green'),
            blue: contributions.get('blue'),
            alpha: contributions.get('alpha')
        };
    }

    // /**
    //  * @param {vscode.Position} "p" the position in question
    //  * @param {String} "start" the chosen start string/bracket
    //  * @param {String} "end" the chosen end string/bracket 
    //  * @returns {vscode.Range} range between start/end brackets
    //  */
    // static getScope(p, start, end){
    //     var num = 5;
    // }

    /**
     * @param {vscode.TextDocument} "d" the active document
     * @param {vscode.Position} "p" the position to be checked
     * @returns {boolean} whether or not the position is commented
     */
    static isPositionCommented(d, p) {
        let line = d.lineAt(p.line);
        if (line.text.trim().startsWith(delimeters.singleLineComment)){
            return true;
        } 

        let offset = d.offsetAt(p);
        let text = d.getText();

        let cmtStartOffset = text.lastIndexOf(delimeters.multilineCommentStart, offset - 1); 
        let cmtEndOffset = text.lastIndexOf(delimeters.multilineCommentEnd, offset - 1);

        if (cmtStartOffset > cmtEndOffset) { // > : after
            return true;
        } 
        
        return false;
    }

}

module.exports = { functions, delimeters};
