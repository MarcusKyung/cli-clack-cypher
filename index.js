#!/usr/bin/env node

import * as p from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import color from 'picocolors';

async function encrypt() {
  const encryptKey = await p.text({
    message: 'Provide encryptKey',
    placeholder: '',
    initialValue: '',
    validate(value) {
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        return 'ERR: Only letters and numbers are allowed. Try again.';
      }
      if (value.length === 0) {
        return 'ERR: encryptKey is required!';
      }
    },
  });

  let offset = 0;
  const vowels = 'aeiouAEIOU';
  const vowelCount = Array.from(encryptKey).filter(char => vowels.includes(char)).length;
  const numberSum = Array.from(encryptKey).filter(char => !isNaN(char)).reduce((sum, char) => sum + parseInt(char), 0);
  const numberCount = Array.from(encryptKey).filter(char => !isNaN(char)).length;
  const consonantCount = encryptKey.length - vowelCount - numberCount;

  console.log(vowelCount);
  console.log(consonantCount);
  console.log(numberSum);

  if (vowelCount > consonantCount) {
    offset = encryptKey.length + numberSum;
  } else if (consonantCount > vowelCount) {
    offset = -encryptKey.length - numberSum;
  }


  let encryptedMessage = '';
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const charCode = char.charCodeAt(0);

    // Only apply the substitution to letters
    if (/[a-zA-Z]/.test(char)) {
      let shiftedCharCode = charCode + offset;

      if ((char >= 'A' && char <= 'Z' && shiftedCharCode > 90) || (char >= 'a' && char <= 'z' && shiftedCharCode > 122)) {
        shiftedCharCode -= 26;
      } else if ((char >= 'A' && char <= 'Z' && shiftedCharCode < 65) || (char >= 'a' && char <= 'z' && shiftedCharCode < 97)) {
        shiftedCharCode += 26;
      }

      encryptedMessage += String.fromCharCode(shiftedCharCode);
    } else {
      encryptedMessage += char;
    }
  }

  console.log('Encrypted Message:', encryptedMessage);
}




async function spinner() {
  const s = p.spinner();
  s.start();
  await setTimeout(2000);
  s.stop();
}

async function main() {
  //Clears console
  console.clear();
  
  await setTimeout(1000);
  
	p.intro(`${color.bgMagenta(color.black(' CLACK CLI CYPHER TOOL '))} `);

  //Spinner set for two seconds
  await spinner();

  //Encrypt/Decrypt Select
  const action = await p.select({
    message: color.bgMagenta(color.black('ENCRYPT/DECRYPT(?)')),
    options: [
      { value: 'encrypt', label: 'ENCRYPT' },
      { value: 'decrypt', label: 'DECRYPT' },
    ],
  });

  if (action === 'encrypt') {
    await encrypt();
  } else {
    await decrypt();
  }

  //Spinner set for two seconds before outro
  await spinner();

  p.outro(`${color.bgMagenta(color.black(`Clack CLI Encryption Program Terminated`))}`);
}

main();