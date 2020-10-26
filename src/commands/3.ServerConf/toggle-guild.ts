import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Guild } from '../../Database/tables/Guilds';
import { Restricted } from '../decorators';
import { config } from '../../';

@Restricted({ userIDs: config.owners })
export default class ToggleGuildCommand implements ICommand {
  name = 'toggle-guild';
  public async execute({ db, msg }: CommandParams): Promise<CommandOutput> {
    const guild: Guild = {
      guildID: msg.member.guild.id,
      ownerID: msg.member.guild.ownerID,
    };
    
    if (await db.guilds.exists(guild)) {
      db.guilds.removeGuild(guild.guildID);
      return 'Successfully removed guild. Bot usage prohibited.';
    }

    await db.guilds.addGuild(guild);
    return 'Successfully added guild. You may use the bot here.';
  }
}
