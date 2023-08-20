#!/usr/bin/env node

import * as p from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';
import color from 'picocolors';
import { spinner } from './spinner.js';
import { encrypt } from './encrypt.js';
import { decrypt } from './decrypt.js';
import { closeProgram } from './closeProgram.js';


async function main() {
  //Clears console to start
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

  await spinner();

  //Encrypt/Decrypt or close select
  const actionType = await p.select({
    message: 'Select an action:',
    options: [
      { value: 'encrypt', label: 'ENCRYPT' },
      { value: 'decrypt', label: 'DECRYPT' },
      { value: 'close', label: 'CLOSE' },
    ],
  });

  if (actionType === 'encrypt') {
    await encrypt();
  } else if (actionType === 'decrypt') {
    await decrypt();
  } 

  await closeProgram()
}

main();