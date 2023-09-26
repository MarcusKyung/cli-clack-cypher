import * as p from '@clack/prompts';
import { spinner } from './spinner.js';

async function decrypt() {
  let decryptKey;
  let confirmDecryptKey = false;

  while (!confirmDecryptKey) {
    decryptKey = await p.text({
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

    confirmDecryptKey = await p.confirm({
      message: 'Confirm decryptKey: ' + decryptKey + ' (Yes/No)',
    });
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

export { decrypt };