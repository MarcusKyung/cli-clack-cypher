import * as p from '@clack/prompts';
import { setTimeout } from 'node:timers/promises';

async function spinner() {
  const s = p.spinner();
  s.start();
  await setTimeout(3000);
  s.stop();
}

export { spinner };
