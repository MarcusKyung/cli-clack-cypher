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

  await spinner();

  const confirmEncryptKey = await p.confirm({
    message: 'Confirm encryptKey: ' + encryptKey + ' (Yes/No)',
  });

  if (!confirmEncryptKey) {
    await encrypt();
  }

  let offset = 0;
  const vowels = 'aeiouAEIOU';
  const vowelCount = Array.from(encryptKey).filter(char => vowels.includes(char)).length;
  const numberSum = Array.from(encryptKey).filter(char => !isNaN(char)).reduce((sum, char) => sum + parseInt(char), 0);
  const numberCount = Array.from(encryptKey).filter(char => !isNaN(char)).length;
  const consonantCount = encryptKey.length - vowelCount - numberCount;

  //Determine offset based on encryptKey
  if (vowelCount > consonantCount) {
    offset = encryptKey.length + numberSum;
  } else if (consonantCount > vowelCount) {
    offset = -encryptKey.length - numberSum;
  }

  console.log(offset); //currently offsets all characters by this count

  const message = await p.text({
    message: 'Provide message',
    placeholder: '',
    initialValue: '',
    validate(value) {
      if (value.length === 0) return `message is required!`;
    },
  });

  await spinner();

  let encryptedMessage = ''; //Initalize empty encryptedMessage String
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const charCode = char.charCodeAt(0);

    if (/[a-zA-Z]/.test(char)) {
      let shiftedCharCode = charCode + offset;

      //If character is uppercase and shiftedCharCode greater than 90 or lowercase and shiftedCharCode greater than 122, subtract 26
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

async function decrypt() {
  const decryptKey = await p.text({
    message: 'Provide decryptKey',
    placeholder: '',
    initialValue: '',
    validate(value) {
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        return 'ERR: Only letters and numbers are allowed. Try again.';
      }
      if (value.length === 0) {
        return 'ERR: decryptKey is required!';
      }
    },
  });

  await spinner();

  const confirmDecryptKey = await p.confirm({
    message: 'Confirm decryptKey: ' + decryptKey + ' (Yes/No)',
  });

  if (!confirmDecryptKey) {
    await decrypt();
  }

  let decryptOffset = 0;
  const decryptVowels = 'aeiouAEIOU';
  const decryptVowelCount = Array.from(decryptKey).filter(char => decryptVowels.includes(char)).length;
  const decryptNumberSum = Array.from(decryptKey).filter(char => !isNaN(char)).reduce((sum, char) => sum + parseInt(char), 0);
  const decryptNumberCount = Array.from(decryptKey).filter(char => !isNaN(char)).length;
  const decryptConsonantCount = decryptKey.length - decryptVowelCount - decryptNumberCount;

  //Determine offset based on encryptKey
  if (decryptVowelCount > decryptConsonantCount) {
    decryptOffset = -decryptKey.length + decryptNumberSum;
  } else if (decryptConsonantCount > decryptVowelCount) {
    decryptOffset = decryptKey.length + decryptNumberSum;
  }

  console.log(decryptOffset); //currently offsets all characters by this count

  const decryptMessage = await p.text({
    message: 'Provide message',
    placeholder: '',
    initialValue: '',
    validate(value) {
      if (value.length === 0) return `message is required!`;
    },
  });

  await spinner();

  let decryptedMessage = ''; //Initalize empty encryptedMessage String
  for (let i = 0; i < decryptMessage.length; i++) {
    const decryptChar = decryptMessage[i];
    const decryptCharCode = decryptChar.charCodeAt(0);

    if (/[a-zA-Z]/.test(decryptChar)) {
      let decryptShiftedCharCode = decryptCharCode + decryptOffset;

      //If character is uppercase and shiftedCharCode greater than 90 or lowercase and shiftedCharCode greater than 122, subtract 26
      if ((decryptChar >= 'A' && decryptChar <= 'Z' && decryptShiftedCharCode > 90) || (decryptChar >= 'a' && decryptChar <= 'z' && decryptShiftedCharCode > 122)) {
        decryptShiftedCharCode -= 26;
      } else if ((decryptChar >= 'A' && decryptChar <= 'Z' && decryptShiftedCharCode < 65) || (decryptChar >= 'a' && decryptChar <= 'z' && decryptShiftedCharCode < 97)) {
        decryptShiftedCharCode += 26;
      }

      decryptedMessage += String.fromCharCode(decryptShiftedCharCode);
    } else {
      decryptedMessage += decryptChar;
    }
  }

  console.log('Decrypted Message:', decryptedMessage);
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

  console.log(`${color.bgMagenta(color.black(`Encryption Program Terminating...`))}`);

  await spinner();

  p.outro(`${color.bgMagenta(color.black(`Clack CLI Encryption Program Terminated`))}`);
}

main();



// vszzc