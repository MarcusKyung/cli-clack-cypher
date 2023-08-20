import * as p from '@clack/prompts';
import { spinner } from './spinner.js';

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

export { encrypt };