// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


import vscode, {CompletionList} from 'vscode';
import file from "./bindings.json";

let bindings = file.bindings;
let dontexpand = file.dontExpand;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
//https://github.com/microsoft/vscode-extension-samples/blob/main/completions-sample/src/extension.ts
export function activate(context: vscode.ExtensionContext) {

	const provider1 = vscode.languages.registerCompletionItemProvider('cpp', {
		provideCompletionItems(document, position) {
			//todo :str = conv(token);
			let end = position.character;
			let start = end - 1;
			let line = document.lineAt(position.line).text;
			while (start > 0 && line[start] >= 'a' && line[start] <= 'z') start--;
			if (line[start] < 'a' || line[start] > 'z') start++;
			let str = line.substring(start, end);
			// console.clear();
			// console.log("---" + conv(str));
			const comp = new vscode.CompletionItem(conv(str));
			comp.kind = vscode.CompletionItemKind.Class;
			// todo :make comp appear at the top of the completion items
			//true means that the array is not complete so it gotta be modified on the fly
			return new CompletionList([comp],true);
		}
	});
	context.subscriptions.push(provider1);
}

// this method is called when your extension is deactivated
export function deactivate() { }

/*
this method convert symbols to its mapping
sample input : "mviplld"
sample output: "map<vector<int>,pair<long long,double>>"
*/
function conv(str: string): string {
	let ret = [""];
	let stack = [];
	let i = 0;
	while (i < str.length) {
		while (i < str.length && !(ret[ret.length - 1] in bindings)) ret[ret.length - 1] += str[i++];
		let cur = ret[ret.length - 1] as keyof typeof bindings;
		if (!(cur in bindings) || (ret.length>1 && stack.length == 0)) return "";
		let n = bindings[cur].number;
		if(cur in dontexpand)ret[ret.length-1] = cur;
		else ret[ret.length - 1] = bindings[cur].value;
		if (n) {
			ret.push('<');
			stack.push(n);
		} else if (stack.length) {
			while (stack.length && stack[stack.length - 1] == 1) {
				stack.pop();
				ret.push('>');
			}
			if (stack.length && stack[stack.length - 1] == 2) {
				stack[stack.length - 1]--;
				ret.push(',');
			}
		}
		ret.push("");
	}
	return ret.join("") + '>'.repeat(stack.length);
}