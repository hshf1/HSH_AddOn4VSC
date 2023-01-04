import { ExtensionContext, commands, workspace, debug, window } from 'vscode'
import { openprefolder } from './checkfolder'
import { checkname } from './filefoldername'
import { checkjsons } from './jsonfilescheck'
import { active_addon } from './status_bar'
import { evaluate } from './evaluate'
import { constregistercommands } from './registercommands'
import { error_message, information_message } from './output'

export function activate(context: ExtensionContext) {

	/**************************************************************************************
	Beim Start einmal durchgeführte Funktionen!
	**************************************************************************************/

	initialize()

	checkjsons()

	if (!(workspace.workspaceFolders?.toString)) {
		openprefolder()
	}

	/**************************************************************************************
	Funktionen, die immer wieder aufgerufen werden können, je nach Event
	**************************************************************************************/

	const eventHandler_checkname = async () => {
		if (active_addon) {
			await checkname()
		}
	}

	workspace.onDidSaveTextDocument(eventHandler_checkname)
	debug.onDidChangeBreakpoints(eventHandler_checkname)

	constregistercommands.forEach(command => {
		context.subscriptions.push(commands.registerCommand(command.name, command.callback));
	})

	context.subscriptions.push(
		commands.registerCommand("check.Solution", async () => {
			const editor = window.activeTextEditor;
			if (!editor) {
				error_message("No active text editor")
				return;
			}

			const code = editor.document.getText();
			console.log(code)
			const exercise = {
				output: "Hello, world!",
				requirements: [
					"main",
					"printf"
				],
			};

			const result = await evaluate(code, exercise);

			if (result.passed) {
				information_message("Solution is correct");
			} else {
				error_message("Solution is incorrect");
			}
		})
	)

}

async function initialize() {
	try {
		const settings = require('./extsettings');
		// Initialize your extension using the settings from extsettings.ts
	} catch (error) {
		console.error(error);
		// Wait for a second before trying again
		await new Promise(resolve => setTimeout(resolve, 1000));
		// Try initializing again
		await initialize();
	}
}

export function deactivate() { }