import color from 'picocolors';
import { spinner } from './spinner.js';

async function closeProgram() {
  await spinner();
  console.log(`${color.bgMagenta(color.black(`Encryption Program Terminating...`))}`);
  await spinner();
}

export { closeProgram };