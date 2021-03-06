import { Client } from 'eris';
import { commandLoader, Context, ICommand } from '../commands';
import * as events from './events';
import Database from '../Database';

export type TicketBotOptions = {
  keys: {
    discord: string;
    mongo: string;
  };
  prefix: string;
  owners: string[];
  botMods: string[];
  development: boolean;
};

export default class TicketBot extends Client {
  public opts: TicketBotOptions;
  public context: Context;
  
  public commands: Map<string, ICommand> = new Map();

  constructor(opts: TicketBotOptions) {
    super(`Bot ${opts.keys.discord}`, {
      getAllUsers: !opts.development,
      restMode: true
    });

    this.opts = opts;
    this.context = {
      commands: this.commands,
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
    await commandLoader.populate();

    for (const [ category, CommandClass ] of commandLoader.commands) {
      const command = new CommandClass() as ICommand;
    
      if (!command.onLoad) {
        command.onLoad = (): void => void 0;
      }
      if (!command.category) {
        command.category = category;
      }
      if (!command.aliases) {
        command.aliases = [];
      }
      if (!command.help) {
        command.help = '';
      }

      command.loaded = false;
    
      this.commands.set(command.name, command);
      for (const alias of command.aliases) {
        this.commands.set(alias, command);
      }
    }

    return Promise.all(
      [ ...this.commands.values() ]
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