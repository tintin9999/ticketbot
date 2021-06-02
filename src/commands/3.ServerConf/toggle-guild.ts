import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Guild } from '../../Database/tables/Guilds';
import { Restricted } from '../decorators';
import { config } from '../../';

@Restricted({ userIDs: config.owners })
export default class ToggleGuildCommand implements ICommand {
  name = 'toggle-guild';
  
  public async execute({ client, db, args }: CommandParams): Promise<CommandOutput> {
    if (!args) {
      return 'gonna need a server ID';
    }
  
    const [id] = args;
    const restGuild = await client.getRESTGuild(id);

    if (!restGuild) {
      return 'This is an invalid guild ID or I\'m not in here.';
    }

    const guild: Guild = {
      guildID: restGuild.id,
      ownerID: restGuild.ownerID,
      whitelists: {
        users: [restGuild.ownerID],
      }
    };

    if (await db.guilds.exists(guild)) {
      db.guilds.removeGuild(guild.guildID);
      return `Successfully removed guild: **${restGuild.name}**`;
    }

    await db.guilds.addGuild(guild);
    const channel = await client.getDMChannel(restGuild.ownerID);
    await channel.createMessage('The bot is now usable in your server, run `pp help` for more information or view the above DM if you got it. Contact Dauntless or tintin if you run into any issues.\n\n**Note**: All tickets are dm\'d to bot moderators, so avoid any false reports etc.').catch((err) => console.log(err));
    return `Successfully added guild: **${restGuild.name}**`;
  }
}
