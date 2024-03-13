import * as vscode from "vscode";

import { CommentParser } from "./commentParser";
import { CommentSyntax } from "./commentParser";
import { BracketParser } from "./bracketParser";
import { Bracket } from "./bracketParser";
import { RGBA } from "./bracketParser";

interface Contributions {
  bracket: Bracket;
  rgba: RGBA;
  syntax: CommentSyntax[];
}

export function activate(context: vscode.ExtensionContext) {
  let commentParser: CommentParser;
  let bracketParser: BracketParser;
  const POLcommand = 'multichar-blockscope-highlighter.PROOFOFLIFE';
  const POLcommandHandler = () => {
    console.log('I am alive');
  };
  context.subscriptions.push(vscode.commands.registerCommand(POLcommand, POLcommandHandler));
  let update = function () {
    let activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    let contributions: Contributions = vscode.workspace.getConfiguration(
      "multichar-blockscope-highlighter"
    ) as any;
    
    // let dbchannel = vscode.window.createOutputChannel("multichar");
    // dbchannel.appendLine("settings input reached in extension file.");
    // dbchannel.show();

    let bracket: Bracket = contributions.bracket;
    let rgba: RGBA = contributions.rgba;
    let syntax: CommentSyntax[] = contributions.syntax;

    let languageId = activeEditor.document.languageId;
    let commentSyntax = syntax.find((s) => {
      return s.languageId.find((s) => s === languageId);
    });

    commentParser = new CommentParser(activeEditor, commentSyntax);
    bracketParser = new BracketParser(
      activeEditor,
      commentParser,
      bracket,
      rgba
    );
    commentParser.update();
  };

  update();

  vscode.window.onDidChangeTextEditorSelection(
    (event) => {
      triggerUpdate2();
    },
    null,
    context.subscriptions
  );

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor) {
        triggerUpdate();
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      update();
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeConfiguration(
    (event) => {
      update();
    },
    null,
    context.subscriptions
  );

  var timeout: NodeJS.Timeout;
  function triggerUpdate() {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(update, 1000);
  }

  var timeout2: NodeJS.Timeout;
  function triggerUpdate2() {
    if (timeout2) {
      clearTimeout(timeout2);
    }
    timeout = setTimeout(() => bracketParser.update(), 50);
  }
}

export function deactivate() {}
