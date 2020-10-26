import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Restricted } from '../decorators';
import { config } from '../..';
import { whitelist } from '../../Database/tables/Guilds';
import { Message } from 'eris';

@Restricted({ userIDs: config.owners })
export default class WhitelistCommand implements ICommand {
  name = 'whitelist';
  aliases = ['wl'];
  help = 'wl [type] [id]';
  default = `**Invalid Arguments**\nUsage: \`${this.help}\`\nAcceptable types: role, channel, user`;

  private validate(msg: Message, id: string, type: whitelist): boolean {
    const guild = msg.member.guild;
    if (type === 'role') {
      return guild.roles.has(id);

    } else if (type === 'channel') {
      const channel = guild.channels.get(id);
      return channel && channel.type === 0;
    
    } else if (type === 'user') {
      return guild.members.has(id);
    }

    return false;
  }

  public async execute({
    db,
    msg,
    args,
  }: CommandParams): Promise<CommandOutput> {
    if (args.length !== 2) {
      return this.default;
    }

    const [wlTypeRaw, wlEntity] = args;
    const wlType = wlTypeRaw.toLowerCase();

    if (!['channel', 'role', 'user'].includes(wlType)) {
      return this.default;
    }

    if (!this.validate(msg, wlEntity, wlType as whitelist)) {
      return `Invalid ${wlType}`;
    }

    await db.guilds.updateWhitelist(
      msg.member.guild.id,
      wlType as whitelist,
      wlEntity,
    );

    let sep;
    switch (wlType) {
      case 'channel':
        sep = '#';
        break;
    
      case 'role': 
        sep = '@&';
        break;
      
      case 'user':
        sep = '@';
        break;
    }

    return `Successfully whitelisted <${sep}${wlEntity}>.`;
  }
}
