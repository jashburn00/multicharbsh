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
let decorations = [];

class functions {

    /**
     * @description called by the Proof of Life command
     */
    static logTest(ed) {
        const editor = ed;
        let delim_range;
        MBSHlog.appendLine("\nExecuting logtest()...");

        /* check if cursor position is commented */{
            // MBSHlog.appendLine("Attempting to check if current position is a comment...");
            // MBSHlog.appendLine(this.isPositionCommented(ed.document, ed.selection.active).toString());
            // MBSHlog.appendLine("");
        }

        /* get current range from cursor position (delim_range is populated) */{
            MBSHlog.appendLine("Attempting to get current range...");
            delim_range = this.getRangeUsingDelimeters(delimeters.startDelimeter, delimeters.endDelimeter, editor);
            if (delim_range == null){
                vscode.window.showInformationMessage("the range returned from our method was NULL.\n");
            }
            else {
                MBSHlog.appendLine("The returned range was: ");
                let text = vscode.window.activeTextEditor.document.getText(delim_range);
                vscode.window.showInformationMessage(text);
                MBSHlog.append(text+"\n"); 
            }
        }
        
        /* apply decoration to delim_range */{
            MBSHlog.appendLine("Attempting to paint the range now:\n"+this.printFormatRange(delim_range));
            this.paintRange(ed, delim_range);
        }
    }

    /**
     * @param {vscode.TextEditor} ed the active text editor
     * @param {vscode.Range} range the range to decorate
     * @description clears previous decoration and applies new one
     */
    static paintRange(ed, range){
        //create the necessary decorationType and decorationOption
        decorations.push( this.createDecoration(delimeters.red, delimeters.green, delimeters.blue, delimeters.alpha));
        const decorationOptions = this.createDecorationOptions(range);
        //clear any existing decoration (must reference original decoration to remove it properly, so we use a list)
        if (decorations.length > 1){
            ed.setDecorations(decorations[0], []);
            decorations = [decorations[1]];
        }
        //apply our new decoration 
        ed.setDecorations(decorations[0], decorationOptions);
    }

    static createDecoration(r, g, b, a){
        let formatString = "rgba("+r+","+g+","+b+","+a+")";
        return vscode.window.createTextEditorDecorationType({
            backgroundColor: ''+formatString,
            isWholeLine: false
        });
    }

    static createDecorationOptions(r){
        const retval = [];
        retval.push({
            range: r
        });
        return retval;
    }

    /**
     * @param {String} start delimeter
     * @param {String} end delimeter
     * @param {vscode.editor} ed the editor
     * @return {vscode.Range} returns null if no valid range was found
     */
    // https://vshaxe.github.io/vscode-extern/vscode/TextDocument.html
    static getRangeUsingDelimeters(start_delim, end_delim, ed){
        const editor = ed;
        const doc = editor.document;
        if (!editor) {
            MBSHlog.appendLine("The passed editor was NULL inside of getRangeUsingDelimeters method.");
            return null;
        }
        const document = editor.document;
        const cursor_pos = editor.selection.active;

        //scan backward until we have found more start delimeters than end delimeters
        // let scan_pos = new vcscursor_pos;
        let scan_pos = new vscode.Position(cursor_pos.line, cursor_pos.character);
        let count = 0;
        
        while (scan_pos){
            
            let start_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, 1*start_delim.length));
            let end_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, 1*end_delim.length));

            // Check the character at the current position, increment the count if it's the start delim, decrement if it's the end delim
            // startDelim: +1  endDelim: -1  count = 1 -> found it
            //MBSHlog.appendLine("start delim is: "+start_delim+", and we are reading: "+document.getText(start_delim_range));

            if (document.getText(start_delim_range) == start_delim){
                if(!functions.isPositionCommentedOrLiteral(document, scan_pos)){
                    count++;
                }
                if (count == 1){
                    break;
                }
            } else if (document.getText(end_delim_range) == end_delim){
                if(!functions.isPositionCommentedOrLiteral(document, scan_pos)){
                    count--;
                }
            }
            // decrement the scan position
            scan_pos = this.decrementCursor(scan_pos, document);
        }
        const left_delim_pos = scan_pos;

        //scan forward until we have found more end delimeters than start delimeters
        scan_pos = new vscode.Position(cursor_pos.line, cursor_pos.character);
        count = 0;
        while(scan_pos){
            let start_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, 1*start_delim.length));
            let end_delim_range = new vscode.Range(scan_pos, scan_pos.translate(0, 1*end_delim.length));

            //scan forward for delimeters until we find an unpaired end delimeter
            MBSHlog.appendLine("end delim is: "+end_delim+" and we are reading: "+document.getText(end_delim_range));

            if(document.getText(start_delim_range) == start_delim){
                count--;
            }else if(document.getText(end_delim_range) == end_delim){
                count++;
                if(count == 1){
                    break;
                }
            }
            //increment cursor
            MBSHlog.appendLine("(jank stuff) scan_pos character is: "+scan_pos.character);
            MBSHlog.appendLine("(jank stuff) and line length is: "+document.lineAt(scan_pos.line).range.end.character);
            //let lastPosition = doc.lineAt(doc.lineCount - 1).range.end;

            if(scan_pos.character < document.lineAt(scan_pos.line).range.end.character){ //if we are safe distance from end of line 
                MBSHlog.appendLine("incrementing cursor normally");
                scan_pos = this.incrementCursor(scan_pos, document); //then increment normally
            } else{ //otherwise...
                MBSHlog.appendLine("Breaking my balls");
                if(scan_pos.line == document.lineCount-1){//if we are at the last line
                    MBSHlog.appendLine("we at last line homie");
                    break; //then we break
                } else{//if not at last line
                    scan_pos = new vscode.Position(scan_pos.translate(1,0).line, 0); //then we manually skip to next line
                }
            }
        }
        const right_delim_pos = scan_pos.translate(0, end_delim.length);
        MBSHlog.appendLine("Right pos: "+this.printFormatPosition(right_delim_pos));
        MBSHlog.appendLine("Left pos: "+this.printFormatPosition(left_delim_pos)); //this is null and it shouldn't be null

        //return a constructed range if valid
        if(left_delim_pos && right_delim_pos){
            return new vscode.Range(left_delim_pos, right_delim_pos);
        } else {
            return null;
        }
    }

    /**
     * @param {vscode.Position} pos: the position to decrement
     * @returns {vscode.Position} the decremented position, or null if the cursor is already at the beginning of the file
     */
    static decrementCursor(pos, doc){

        if (pos.character > 0){
            let new_pos = pos.translate(0, -1);
            return new_pos; 
        }
        else if (pos.line > 0){
            let new_pos = pos.translate(-1, doc.lineAt(pos.line - 1).text.length);
            return new_pos;
        }
        else {
            MBSHlog.appendLine('IN DECREMENTCURSOR: at beginning of range, so returning null. ('+this.printFormatPosition(pos)+')');
            return null;
        }
    }

    /**
     * @param {vscode.Position} pos: the position to increment
     * @returns {vscode.Position} the incremented position, or null if increment not possible
     */
    static incrementCursor(pos, doc){
        MBSHlog.appendLine("(In IncrementCursor) before increment: "+this.printFormatPosition(pos));
        let lastPosition = doc.lineAt(doc.lineCount - 1).range.end;
        MBSHlog.appendLine("E pp");
        if (pos.isEqual(lastPosition)){
            MBSHlog.appendLine("IN INCREMENTCURSOR: returning null because we are at the last position");
            return null; 
        } else if (pos.character == doc.lineAt(pos.line).text.length){
            MBSHlog.appendLine("IN INCREMENTCURSOR: returning first character at next line");
            return new vscode.Position(pos.line+1, 0);
        } else {
            MBSHlog.appendLine("IN INCREMENTCURSOR: incrementing normally (horizontally)");
            return new vscode.Position(pos.line, pos.character+1);
        }
    }
    
    
    /** 
     * @description reads user settings into 'delimeters' variable
     */
    static loadDelimeters() {
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

    /**
     * @param {vscode.TextDocument} "d" the active document
     * @param {vscode.Position} "p" the position to be checked
     * @returns {boolean} whether or not the position is commented
     */
    static isPositionCommentedOrLiteral(d, p) {
        let line = d.lineAt(p.line);
        if (line.text.trim().startsWith(delimeters.singleLineComment)){
            return true;
        } 

        //for multiline comments
        let offset = d.offsetAt(p);
        let text = d.getText();

        let cmtStartOffset = text.lastIndexOf(delimeters.multilineCommentStart, offset - 1); 
        let cmtEndOffset = text.lastIndexOf(delimeters.multilineCommentEnd, offset - 1);
        

        if (cmtStartOffset > cmtEndOffset) { // > : after
            return true;
        } 

        //TODO: for string literals 
        let offsetL = d.offsetAt(p);
        let textL = d.getText();
        // 'poop' lsdkjfslkdfj 'dslfksjdf' asldkfdjlaksd
        let cmtStartOffsetL = text.lastIndexOf("'", offsetL - 1); 
        let cmtEndOffsetL = text.lastIndexOf("'", offsetL - 1);
        

        if (cmtStartOffset > cmtEndOffset) { // > : after
            return true;
        } 
        
        return false;
    }

    static printFormatRange(range){
        return "["+range.start.line+", "+range.start.character+"] ["+range.end.line+", "+range.end.character+"]";
    }

    static printFormatPosition(pos){
        return "["+pos.line+","+pos.character+"]";
    }

}

module.exports = { 
    functions: functions,
    delimeters: delimeters,
    log: MBSHlog
};
