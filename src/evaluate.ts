import { spawn, spawnSync} from "child_process";
import { writeFileSync } from "fs";
import { join, dirname, basename, parse } from "path";
import { window } from "vscode";

export interface Exercise {
  // Exercise requirements go here
  // For example:
  output: string;
  requirements: string[];
}

export interface EvaluationResult {
  passed: boolean;
  requirements: string[];
}

export async function evaluate(code: string, exercise: Exercise): Promise<EvaluationResult> {

  // Write the code to a file
  const codePath = join('/Users/ck/Documents/C_Uebung', "code.c");
  const editor = window.activeTextEditor;
  let document: any, dirName: any, baseName: any, baseNameNoExtension: any;

  if (editor) {
    document = editor.document.fileName;
    console.log(`The current document is: ${document}`);
    dirName = dirname(document);
    baseName = basename(document);
    baseNameNoExtension = parse(baseName).name;
  }
  console.log(`dirName: ${dirName}`)
  console.log(`baseName: ${baseName}`)
  console.log(`basenamenoextension: ${baseNameNoExtension}`)
  const options = {
    type: "cppbuild",
    commands: "/usr/bin/gcc",
    cwd: "/Users/ck/Documents/C_Uebung",
    env: {},
    args: [
      "-g",
      "code.c",
      "-o",
      "/Users/ck/Documents/C_Uebung/code"
    ],
    problemMatcher: [
      "$gcc"
    ],
    group: {
      "kind": "build",
      "isDefault": true
    }
    // Other options go here
  };
  writeFileSync(codePath, code, { encoding: "utf-8" });
  console.log(`codePath: ${codePath}`)
  // Compile the code


  const result = spawnSync("code-runner.run", options);

  if (result.error) {
    // Handle the error
  } else {
    const output = result.stdout.toString();
    console.log(`error: ${output}`)
    // Use the output to check if the compilation was successful
  }

  const compileProcess = spawn("gcc", [
    "-g",
    "/Users/ck/Documents/C_Uebung/main.c",
    "-o",
    "/Users/ck/Documents/C_Uebung/main"
  ])
  console.log(`compileProcess: ${compileProcess}`)
  // Capture the output of the compiler
  let compileOutput = ''

  compileProcess.stdout.on("data", (data) => {
    compileOutput += data;
    console.log(`stdout: ${compileOutput}`)
  });
  compileProcess.stderr.on("data", (data) => {
    compileOutput += data;
    console.log(`stderr: ${compileOutput}`)
  });

  console.log(`compileOutput: ${compileOutput}`)

  // Wait for the compiler to finish
  await new Promise((resolve, reject) => {
    compileProcess.on("exit", resolve);
    compileProcess.on("error", reject);
  });

  // Check if there were any compile errors
  if (compileProcess.exitCode !== 0) {
    return { passed: false, requirements: [] };
  }

  // Run the compiled program
  const runProcess = spawn("/Users/ck/Documents/C_Uebung/main");
  console.log(`runProcess: ${runProcess}`)
  // Capture the output of the program
  let runOutput = "";
  runProcess.stdout.on("data", (data) => {
    runOutput += data;
    console.log(`stdourunprocess: ${runProcess}`)
  });
  runProcess.stderr.on("data", (data) => {
    runOutput += data;
    console.log(`stderrrunprocess: ${runProcess}`)
  });

  // Wait for the program to finish
  await new Promise((resolve, reject) => {
    runProcess.on("exit", resolve);
    runProcess.on("error", reject);
  });

  // Check if the output matches the expected output
  const passed = runOutput === exercise.output;
  console.log(`passed: ${passed}`)
  console.log(`runOutputpassed: ${runOutput}`)
  console.log(`exercise.output: ${exercise.output}`)
  // Check if the code meets the requirements
  const requirements = exercise.requirements.filter((req) => !code.includes(req));
  console.log(`requirements: ${requirements}`)
  if (requirements.length === 0) {
    console.log("The code meets all of the requirements!");
  } else {
    console.log("The code does not meet the following requirements:");
    console.log(requirements.join(", "));
  }
  return { passed, requirements };
}
