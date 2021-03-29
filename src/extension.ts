// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


import vscode from 'vscode';
import arr from "./bindings.json";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
//https://github.com/microsoft/vscode-extension-samples/blob/main/completions-sample/src/extension.ts
export function activate(context: vscode.ExtensionContext) {
	console.clear();
	console.log("-------");
	console.log(conv("vvvs"));
	const provider1 = vscode.languages.registerCompletionItemProvider('cpp', {
		provideCompletionItems(document, position, token) {
				const ci = new vscode.CompletionItem('vector<int>'); 
				return [ci];
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
function conv (str:string):string{
	let ret =[""];
	let stack = [];
	let i = 0;
	while(i<str.length){
		while(i<str.length && !(ret[ret.length-1] in arr))ret[ret.length-1]+=str[i++];
		let cur = ret[ret.length-1] as keyof typeof arr;
		if(!(cur in arr))return "";
		let n= arr[cur].number;
		ret[ret.length-1] =arr[cur].value;
		if(n){
			ret.push('<');
			stack.push(n);
		}else if(stack.length){
			while(stack.length && stack[stack.length-1]==1){
				stack.pop();
				ret.push('>');
			}
			if(stack.length && stack[stack.length-1] ==2){
				stack[stack.length-1]--;
				ret.push(',');
			}
		}
		ret.push("");
	}
	return ret.join("")+'>'.repeat(stack.length);
}