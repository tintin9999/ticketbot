import { ICommand, CommandParams, CommandOutput } from '../Command';

export default class UnwhitelistCommand implements ICommand {
  name = 'unwhitelist';
  aliases = ['unwl'];
  help = 'unwl [id]';

  public async execute({
    db,
    msg,
    args,
  }: CommandParams): Promise<CommandOutput> {
    const [id] = args;

    const guild = await db.guilds.get(msg.member.guild.id);

    if (id === guild.ownerID) {
      return 'Can not remove guild owner from whitelist.';
    }

    const entity = await db.guilds.removeWhitelist(guild, id);

    if (!entity) {
      return "Couldn't remove entity from whitelist, was it even included?";
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
