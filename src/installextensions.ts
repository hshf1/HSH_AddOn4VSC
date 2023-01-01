import * as vscode from 'vscode'
import { IS_LINUX, IS_OSX } from './extsettings'

export function allsystems() {
	const extensions = vscode.extensions.all
	if (extensions.filter((extension) => extension.id.startsWith('formulahendry.code-runner')).length == 0) {
		vscode.commands.executeCommand('workbench.extensions.installExtension', 'formulahendry.code-runner')
	}
	if (extensions.filter((extension) => extension.id.startsWith('ms-vscode.cpptools')).length == 0) {
		vscode.commands.executeCommand('workbench.extensions.installExtension', 'ms-vscode.cpptools')
	}
	if (extensions.filter((extension) => extension.id.startsWith('ms-vsliveshare.vsliveshare')).length == 0) {
		vscode.commands.executeCommand('workbench.extensions.installExtension', 'ms-vsliveshare.vsliveshare')
	}
	if (extensions.filter((extension) => extension.id.startsWith('ms-vsliveshare.vsliveshare-audio')).length == 0) {
		vscode.commands.executeCommand('workbench.extensions.installExtension', 'ms-vsliveshare.vsliveshare-audio')
	}
	if (IS_LINUX || IS_OSX) {
		linuxmacos()
	}
}

function linuxmacos() {
	const extensions = vscode.extensions.all
	if (extensions.filter((extension) => extension.id.startsWith('vadimcn.vscode-lldb')).length == 0) {
		vscode.commands.executeCommand('workbench.extensions.installExtension', 'vadimcn.vscode-lldb')
	}
}