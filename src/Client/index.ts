import { Client } from 'eris';
import { commands, Context } from '../commands';
import * as events from './events';
import Database from '../Database';

export type TicketBotOptions = {
  keys: {
    discord: string;
    mongo: string;
  };
  guildIDs: string[];
  channels: {
    lonBotCat: string;
    lonTestCat: string;
    tdkModCat: string;
    dvModCat: string;
  };
  roles: {
    lonAdmin: string;
    lonTesters: string;
    dvMod: string;
    dvAdmin: string;
    tdkMod: string;
    tdkAdmin: string;
  };
  prefix: string;
  owners: string[];
  development: boolean;
};

export default class TicketBot extends Client {
  public opts: TicketBotOptions;
  public context: Context;

  constructor(opts: TicketBotOptions) {
    super(`Bot ${opts.keys.discord}`, {
      getAllUsers: !opts.development,
      restMode: true
    });

    this.opts = opts;
    this.context = {
      commands,
      client: this,
      db: new Database(),
    };

    this.loadEvents();
  }

  public async bootstrap(): Promise<void> {
    await Promise.all([
      super.connect(),
      this.context.db.bootstrap()
        .then(() => this.loadCommands())
    ]);
  }

  public async loadCommands(): Promise<number> {
    return Promise.all(
      [ ...commands.values() ]
        .map(command => {
          if (!command.loaded) {
            command.loaded = true;
            command.onLoad(this.context);
          }
        })
    ).then(r => r.length);
  }

  public loadEvents(): void {
    for (const event of Object.values(events)) {
      this[(event.once ? 'once' : 'on') as 'on'](event.packetName, event.handler.bind(this));
    }
  }
}