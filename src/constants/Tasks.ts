export const tasksWindows = [
	{
		"type": "cppbuild",
		"label": "ckompilieren",
		"command": "gcc.exe",
		"args": [
			"-g",
			"\${file}",
			"-o",
			"\${fileDirname}\\\\\${fileBasenameNoExtension}.exe"
		],
		"options": {
			"cwd": "\${workspaceFolder}"
		},
		"problemMatcher": [
			"$gcc"
		],
		"group": {
			"kind": "build",
			"isDefault": true
		},
		"detail": "Compiler: gcc.exe"
	},
	{
		"type": "cppbuild",
		"label": "cppkompilieren",
		"command": "g++.exe",
		"args": [
			"-g",
			"\${file}",
			"-o",
			"\${fileDirname}\\\\\${fileBasenameNoExtension}.exe"
		],
		"options": {
			"cwd": "\${workspaceFolder}"
		},
		"problemMatcher": [
			"$gcc"
		],
		"group": {
			"kind": "build",
			"isDefault": true
		},
		"detail": "Compiler: g++.exe"
	}
];

export const tasksLinux = [
	{
		"type": "cppbuild",
		"label": "ckompilieren",
		"command": "/usr/bin/gcc",
		"args": [
			"-g",
			"\${file}",
			"-o",
			"\${fileDirname}/\${fileBasenameNoExtension}",
			"-lm"
		],
		"options": {
			"cwd": "\${fileDirname}"
		},
		"problemMatcher": [
			"$gcc"
		],
		"group": {
			"kind": "build",
			"isDefault": true
		},
		"detail": "Vom Debugger generierte Aufgabe."
	},
	{
		"type": "cppbuild",
		"label": "cppkompilieren",
		"command": "/usr/bin/g++",
		"args": [
			"-g",
			"\${file}",
			"-o",
			"\${fileDirname}/\${fileBasenameNoExtension}",
			"-lm"
		],
		"options": {
			"cwd": "\${fileDirname}"
		},
		"problemMatcher": [
			"$gcc"
		],
		"group": {
			"kind": "build",
			"isDefault": true
		},
		"detail": "Vom Debugger generierte Aufgabe."
	}
];

export const tasksMac = [
	{
		"type": "cppbuild",
		"label": "ckompilieren",
		"command": "/usr/bin/gcc",
		"args": [
			"-g",
			"\${file}",
			"-o",
			"\${fileDirname}/\${fileBasenameNoExtension}"
		],
		"options": {
			"cwd": "\${fileDirname}"
		},
		"problemMatcher": [
			"$gcc"
		],
		"group": {
			"kind": "build",
			"isDefault": true
		},
		"detail": "Vom Debugger generierte Aufgabe."
	},
	{
		"type": "cppbuild",
		"label": "cppkompilieren",
		"command": "/usr/bin/g++",
		"args": [
			"-g",
			"\${file}",
			"-o",
			"\${fileDirname}/\${fileBasenameNoExtension}"
		],
		"options": {
			"cwd": "\${fileDirname}"
		},
		"problemMatcher": [
			"$gcc"
		],
		"group": {
			"kind": "build",
			"isDefault": true
		},
		"detail": "Vom Debugger generierte Aufgabe."
	}
];