// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "helloworld" is now active!');

	
	let disposable = vscode.workspace.onDidChangeTextDocument(
		() => {
		
		const editor = vscode.window.activeTextEditor;
		if(!editor)
		{
			vscode.window.showWarningMessage("no editor");
			return;
		}

		const text = editor.document.getText();

		var cords = editor.selection.active;
		var row = cords.line;
		var col = cords.character;
		console.log(row, col);
		var ind =0;
		var t = text;
		let x = row > 0;
		
		while(row--)
			ind = text.indexOf('\n',ind+1);
		
		if(x) ind++;
		let newText = text.substr(ind);

		console.log(newText[col]);

		//vscode.window.showInformationMessage(t);

		//console.log(t);
	});
	
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
