import { ICommand, CommandParams, CommandOutput } from '../Command';

export default class UnwhitelistCommand implements ICommand {
  name = 'unwhitelist';
  aliases = ['unwl'];
  help = 'unwl [id]';

  public async execute({ db, msg, args }: CommandParams): Promise<CommandOutput> {
    const [id] = args;

    const guild = await db.guilds.get(msg.member.guild.id);

    if (id === guild.ownerID) {
      return 'Can\'t remove guild owner from whitelist.';
    }

    const entity = await db.guilds.removeWhitelist(guild, id);

    if (!entity) {
      return 'Couldn\'t remove entity from whitelist, are you sure it was there?';
    }

    let sep: string;
    switch (entity.type) {
      case 'channels':
        sep = '#';
        break;

      case 'roles':
        sep = '@&';
        break;

      case 'users':
        sep = '@';
        break;
    }

    return `Successfully unwhitelisted <${sep}${id}>.`;
  }
}
