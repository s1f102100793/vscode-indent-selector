import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "indent-selector.selectIndent",
    () => {
      vscode.window.showInformationMessage("Indent Selector Activated");

      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        return;
      }

      const editor = activeEditor;
      const document = editor.document;
      const selection = editor.selection;

      const currentLine = selection.start.line;
      const currentIndentLevel = getIndentationLevel(
        document.lineAt(currentLine).text
      );

      let startLine = currentLine;
      let endLine = currentLine;

      while (
        startLine > 0 &&
        getIndentationLevel(document.lineAt(startLine - 1).text) >=
          currentIndentLevel
      ) {
        startLine--;
      }

      while (
        endLine < document.lineCount - 1 &&
        getIndentationLevel(document.lineAt(endLine + 1).text) >=
          currentIndentLevel
      ) {
        endLine++;
      }

      const startPosition = new vscode.Position(startLine, 0);
      const endPosition = new vscode.Position(
        endLine,
        document.lineAt(endLine).text.length
      );
      const newSelection = new vscode.Selection(startPosition, endPosition);
      editor.selection = newSelection;
    }
  );

  context.subscriptions.push(disposable);

  const getIndentationLevel = (lineText: string): number => {
    const tabSizeRaw = vscode.window.activeTextEditor?.options.tabSize;
    const tabSize = typeof tabSizeRaw === "number" ? tabSizeRaw : 4;
    const lineIndentation = lineText.replace(/\t/g, " ".repeat(tabSize));
    const match = lineIndentation.match(/^\s+/);
    return match ? match[0].length : 0;
  };
}

export function deactivate() {
  console.log("Extension 'indent-selector' is now deactivated.");
}
