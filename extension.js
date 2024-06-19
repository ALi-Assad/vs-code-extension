const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let changedLine;
	let activeTextEditorId;
	const textEditors = new Map();
	vscode.workspace.onDidChangeTextDocument(async () => {
		let anchPos = vscode.window.activeTextEditor.selection.anchor;
		changedLine = anchPos;
		textEditors.set(activeTextEditorId, anchPos);
		console.log('changed', changedLine, anchPos);
	});


	vscode.window.onDidChangeActiveTextEditor(async (editor) => {
		if (editor) {
			activeTextEditorId = editor.document.fileName;
			changedLine = textEditors.get(activeTextEditorId);
		}
	});

	window = vscode.workspace.window;

	// Register a custom undo command
	const customUndoDisposable = vscode.commands.registerCommand('extension.customUndo', async () => {
		// Execute custom logic
		editor = vscode.window.activeTextEditor;
		const position = new vscode.Position(changedLine.c, changedLine.e + 1);
		const selection = new vscode.Selection(position, position);
		editor.selection = selection;
		editor.revealRange(selection);
	});

	context.subscriptions.push(customUndoDisposable);

	context.subscriptions.push(vscode.commands.registerCommand('undo', async () => {
		let anchPos = vscode.window.activeTextEditor.selection.anchor;
		if ((changedLine?.c == undefined || changedLine?.e == undefined) || (anchPos.c == changedLine.c && anchPos.e == changedLine.e)) {
			await vscode.commands.executeCommand('default:undo');
		} else {
			await vscode.commands.executeCommand('extension.customUndo');
		}
	}));
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
