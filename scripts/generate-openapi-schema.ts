import { writeFile, stat, mkdir } from 'node:fs/promises';
import { app } from '../src/app';

async function run() {
  await app.ready();

  if (app.swagger === null || app.swagger === undefined) {
    throw new Error('@fastify/swagger plugin is not loaded');
  }

  try {
    await stat('doc');
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await mkdir('doc');
    } else {
      throw err;
    }
  }

  const schema = JSON.stringify(app.swagger(), undefined, 2);
  await writeFile('doc/openapi.json', schema, { flag: 'w+' });

  await app.close();
}

run();
