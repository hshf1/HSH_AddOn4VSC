import { InputBoxOptions, window } from "vscode";
import { evaluate } from "./runexercises";

export let sum = 0
export let number1: number, number2: number

export async function addfunc() {
    // Read the two numbers from the user

    const options: InputBoxOptions = {
        prompt: 'Eingeben der ersten Ganzzahl:',
        placeHolder: '0'
    };

    number1 = Number(await window.showInputBox(options));

    options.prompt = 'Eingeben der zweiten Ganzzahl:';
    number2 = Number(await window.showInputBox(options));

    // Calculate the sum of the two numbers
    sum = Number(number1) + Number(number2)
    const constexercise = [
        {
            output: `${sum}`,
            requirements: []
        },
    ]
    evaluate(constexercise[0], 0);
}