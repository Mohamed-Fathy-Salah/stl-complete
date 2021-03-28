// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


import * as vscode from 'vscode';
import fetch from "node-fetch";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.workspace.onDidChangeTextDocument(
		async () => {
		
		const editor = vscode.window.activeTextEditor;
		if(!editor)
		{
			vscode.window.showWarningMessage("no editor");
			return;
		}

		var cords = editor.selection.active;
		var row = cords.line;
		var col = cords.character;

		//getting the active line in editor
		let newText = editor.document.lineAt(row).text;

		//making a range
		let range = new vscode.Range(row, 0 ,row, col+1);

		//displaying cordinates and the character written in edtior
		console.log(row, col);
		console.log(newText.charAt(col));

		//fetching data from api for testing
		const response = await fetch(
			'https://api.datamuse.com/words?ml='+newText.replace(" ","+")
			);
		const data = await response.json();

		//creating a quick pick menu to to replace a range in editor by a chosen word
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = data.map( (x:any) => ({label: x.word}) );
		
		quickPick.onDidChangeSelection(([item]) => {
			if (item) 
				editor.edit((edit) => {
					//replacing a range by a word
					edit.replace(range, item.label);
				})
				quickPick.dispose();
			
		});

		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show(); 
	});
	
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
