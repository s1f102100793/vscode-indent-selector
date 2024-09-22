import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "indent-selector.selectIndent",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const position = editor.selection.active;

      const foldingRanges = await vscode.commands.executeCommand<
        vscode.FoldingRange[] | undefined
      >("vscode.executeFoldingRangeProvider", document.uri);

      if (foldingRanges) {
        const sortedRanges = foldingRanges.sort((a, b) => {
          const aSize = a.end - a.start;
          const bSize = b.end - b.start;
          return aSize - bSize;
        });

        for (const range of sortedRanges) {
          const start = new vscode.Position(range.start, 0);
          const endLine = range.end + 1;
          const endCharacter = document.lineAt(endLine).text.length;
          const end = new vscode.Position(endLine, endCharacter);

          const foldingRange = new vscode.Range(start, end);

          if (foldingRange.contains(position)) {
            editor.selection = new vscode.Selection(start, end);
            editor.revealRange(foldingRange);
            return;
          }
        }
      }

      vscode.window.showInformationMessage(
        "現在の位置に対応するインデント範囲が見つかりませんでした。"
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
