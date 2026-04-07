import BaseModule from "./BaseModule.mjs";

export class Toolbox extends BaseModule {
    constructor(coreObject) { super(coreObject); }

    generateRandomString(length = 30, allowRepeats = false) {
        const alphabet = String('ABCDEFGHIKLMNOPQRSTVXYZabcdefghiklmnopqrstvxyz1234567890').split('');

        let index, letter, string = '';
        for (let i = 0; i < length; i++) {
            do {
                index = Math.floor(Math.random() * alphabet.length);
                letter = alphabet[index];
            } while (letter === null);

            string += letter;
            if (!allowRepeats) alphabet[index] = null;
        }

        return string;
    }

    generateRandomNumber(min = 0, max = 100){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}