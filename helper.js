const vscode = require('vscode');
const MBSHlog = vscode.window.createOutputChannel('MBSH Log'); //this replaces the need for running POL command
let delimeters = { //these values get overwritten by user input; this is just in case the default settings don't get applied
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
    static logTest(ed) {
        const editor = ed;
        let delim_range = this.getRangeUsingDelimeters(delimeters.startDelimeter, delimeters.endDelimeter, editor);
        if (delim_range == null){
            vscode.window.showInformationMessage("8===>~~");
        }
        else {
            let text = vscode.window.activeTextEditor.document.getText(delim_range);
            vscode.window.showInformationMessage(text); //this works
        }
        //vscode.window.showInformationMessage(this.checkIfBoundedByDelim(',', '.'));
        //this.checkIfBoundedByDelim('testicleft', 'testicright'); //this causes an error currently
    }

    /**
     * //TODO: this doesn't do anything. Issue could be elsewhere
     * @param {vscode.TextEditor} ed the active text editor
     */
    // static paintMyShit(ed){
    //     let paintRange = this.getRangeUsingDelimeters(delimeters.startDelimeter, delimeters.endDelimeter);
    //     let decoration = this.getDecoration(delimeters.red, delimeters.green, delimeters.blue, delimeters.alpha);

    //     ed.setDecorations(decoration, paintRange);
    // }

    // static getDecoration(r, g, b, a){
    //     let formatString = "rgba("+r+","+g+","+b+","+a+")";

    //     return vscode.window.createTextEditorDecorationType({
    //         backgroundColor: formatString,
    //         isWholeLine: true
    //     });
    // }

    /**
     * @param {String} start delimeter
     * @param {String} end delimeter
     * @return {vscode.Range} returns null if no valid range was found
     */
    // https://vshaxe.github.io/vscode-extern/vscode/TextDocument.html
    static getRangeUsingDelimeters(start_delim, end_delim, ed){
        // get active text editor and cursor position

        // const editor = vscode.window.activeTextEditor;
        const editor = ed;
        if (!editor) {
            return null;
        }
        const document = editor.document;
        const cursor_pos = editor.selection.active;

        // Loop over the left of the cursor to find where the first open start delim is
        let scan_pos = cursor_pos;
        let count = 0;
        
        MBSHlog.appendLine('~~~~~~~~~~about to try sjum~~~~~~~~~~~~~~');

        let token = 0;
        //scan backward
        while (scan_pos){
            token++;
            // let start_delim_range = new vscode.Range(scan_pos.translate(0, -1*start_delim.length), scan_pos);
            // let end_delim_range = new vscode.Range(scan_pos.translate(0, -1*end_delim.length), scan_pos);


            // Check the character at the current position, increment the count if it's the start delim, decrement if it's the end delim
            // startDelim -> +1  endDelim -> -1  count = 1 -> found it
            // if (document.getText(start_delim_range) == start_delim){
            //     if(!functions.isPositionCommented(document, scan_pos)){
            //         count++;
            //     }
            //     if (count == 1){
            //         break;
            //     }
            // }
            // else if (document.getText(end_delim_range) == end_delim){
            //     if(!functions.isPositionCommented(document, scan_pos)){
            //         count--;
            //     }
            // }
            // decrement the scan position
            MBSHlog.appendLine('token: '+token.toString());
            // vscode.window.showInformationMessage("token: "+token.toString());
            scan_pos = this.decrementCursor(scan_pos, document);
            if (token > 10){
                break;
            }
        }
        // vscode.window.showInformationMessage("token: "+token.toString());

        MBSHlog.appendLine('~~~~~~~~~~done with sjum~~~~~~~~~~~~~~');

        // if (!scan_pos){
        //     vscode.window.showInformationMessage('RETURNING NULL start bracket');
        //     return null;
        // }

        // const left_delim_pos = scan_pos;
        
        // scan_pos = cursor_pos;
        // count = 0;

        // //scan forward
        // while(scan_pos){
        //     //create range using current position
        //     let start_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, start_delim.length));
        //     let end_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, end_delim.length));
            
        //     //check if we found the delimeter
        //     if(document.getText(start_delim_range) == start_delim){
        //         if(!this.isPositionCommented(document, scan_pos)){
        //             count++;
        //         }
        //     }
        //     if(document.getText(end_delim_range) == end_delim){
        //         if(!this.isPositionCommented(document, scan_pos)){
        //             count--;
        //         }
        //         if(count == -1){
        //             break; 
        //         }
        //     }

        //     scan_pos = this.incrementCursor(scan_pos, document);
        // }

        // if (!scan_pos){
        //     vscode.window.showInformationMessage('RETURNING NULL end bracket');
        //     return null;
        // }

        // const right_delim_pos = scan_pos;
        // vscode.window.showInformationMessage('RETURNING RANGE: '+left_delim_pos+", "+right_delim_pos);
        // return new vscode.Range(left_delim_pos, right_delim_pos); //this is the region that must get painted
    }

    /**
     * @param {vscode.Position} pos: the position to decrement
     * @returns {vscode.Position} the decremented position, or null if the cursor is at the beginning of the file
     */
    static decrementCursor(pos, doc){
        
        // vscode.window.showInformationMessage('decrementCursor() '+pos.character.toString()+' '+pos.line.toString());
        // vscode.window.showInformationMessage('decrementCursor() has begun');
        MBSHlog.appendLine('decrementCursor() '+pos.character.toString()+' '+pos.line.toString());
        
        if (pos.character > 0){
            MBSHlog.appendLine('Epstein');
            // let new_pos = vscode.Position(pos.line, pos.character - 1);
            let new_pos = pos.translate(0, -1);
            return new_pos;
        }
        else if (pos.line > 0){
            MBSHlog.appendLine('didnt'); 
            // vscode.window.showInformationMessage("didn't");
            // let new_line = doc.lineAt(pos.line - 1);
            // let new_pos = vscode.Position(pos.line - 1, new_line.text.length);
            let new_pos = pos.translate(-1, doc.lineAt(pos.line - 1).text.length);
            return new_pos;
            // return null;
        }
        else {
            MBSHlog.appendLine('kill himself');
            // vscode.window.showInformationMessage("kill himself");
            // character and line are always nonnegative, so this branch means pos.character == 0 and pos.line == 0
            // so we are at the beginning of the file
            // return new_pos;
            return null;
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

module.exports = { 
    functions: functions,
    delimeters: delimeters
};
