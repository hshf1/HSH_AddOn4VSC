export const launchWindows = {
    "version": "0.2.0",
    "configurations": [
        {
            "name": "C -> Aktive-Datei debuggen",
            "type": "cppdbg",
            "request": "launch",
            "stopAtEntry": false,
            "externalConsole": false,
            "MIMode": "gdb",
            "program": "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe",
            "cwd": "\${workspaceFolder}",
            "preLaunchTask": "ckompilieren"
        },
        {
            "name": "C++ -> Aktive-Datei debuggen",
            "type": "cppdbg",
            "request": "launch",
            "stopAtEntry": false,
            "externalConsole": false,
            "MIMode": "gdb",
            "program": "\${fileDirname}\\\\\${fileBasenameNoExtension}.exe",
            "cwd": "\${workspaceFolder}",
            "preLaunchTask": "cppkompilieren"
        },
        {
            "name": "Python -> Aktive-Datei debuggen",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "name": "Java -> Aktive-Datei debuggen",
            "type": "java",
            "request": "launch",
            "mainClass": "${file}"
        }
    ]
};

export const launchLinux = {
    "version": "0.2.0",
    "configurations": [
        {
            "name": "C -> Aktive-Datei",
            "type": "lldb",
            "request": "launch",
            "MIMode": "gdb",
            "program": "\${fileDirname}/\${fileBasenameNoExtension}",
            "cwd": "\${fileDirname}",
            "preLaunchTask": "ckompilieren"
        },
        {
            "name": "C++ -> Aktive-Datei debuggen",
            "type": "lldb",
            "request": "launch",
            "MIMode": "gdb",
            "program": "\${fileDirname}/\${fileBasenameNoExtension}",
            "cwd": "\${fileDirname}",
            "preLaunchTask": "cppkompilieren"
        },
        {
            "name": "Python -> Aktive-Datei",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "type": "java",
            "name": "Java -> Aktive-Datei",
            "request": "launch",
            "mainClass": "${file}"
        }
    ]
};

export const launchMac = {
    "version": "0.2.0",
    "configurations": [
        {
            "type": "cppdbg",
            "request": "launch",
            "name": "C -> Aktive-Datei",
            "program": "${fileDirname}/${fileBasenameNoExtension}",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "lldb",
            "preLaunchTask": "ckompilieren"
        },
        {
            "type": "cppdbg",
            "request": "launch",
            "name": "C++ -> Aktive-Datei debuggen",
            "program": "${fileDirname}/${fileBasenameNoExtension}",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "lldb",
            "preLaunchTask": "cppkompilieren"
        },
        {
            "name": "Python -> Aktive-Datei",
            "type": "python",
            "request": "launch",
            "program": "${file}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
        {
            "type": "java",
            "name": "Java -> Aktive-Datei",
            "request": "launch",
            "mainClass": "${file}"
        }
    ]
};