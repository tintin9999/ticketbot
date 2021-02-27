import { promises as fs } from 'fs';
import * as path from 'path';

const commands = [];
const nonCommands = [ 'Command', 'commands', 'index', 'decorators' ];

export default {
  commands,

  async populate(): Promise<void> {
    for (const category of await fs.readdir(__dirname)) {
      if (nonCommands.some(nonCommand => category.startsWith(nonCommand))) {
        continue;
      }

      for (const filename of await fs.readdir(path.resolve(__dirname, category))) {
        const mdl = await import(path.join(__dirname, category, filename));
        commands.push([category, mdl.default]);
      }
    }
  }
};
