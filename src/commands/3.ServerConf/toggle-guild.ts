import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Guild } from 'eris';
import { GuildDB } from '../../Database/tables/Guilds';
import { Restricted } from '../decorators';
import { config } from '../../';

@Restricted({ userIDs: config.botMods })
export default class ToggleGuildCommand implements ICommand {
  name = 'toggle-guild';
  alias: ['addguild'];
  
  public async execute({ client, db, args }: CommandParams): Promise<CommandOutput> {
    const [id] = args;

    if (!id) {
      return "I'm gonna need a server ID to add/remove.";
    }

    let restGuild: Guild;

    try {
      restGuild = await client.getRESTGuild(id);
    } catch (_) {
      return 'This is an invalid guild ID or I\'m not in here.';
    }

    const guild: GuildDB = {
      guildID: restGuild.id,
      ownerID: restGuild.ownerID,
      whitelists: {
        users: [restGuild.ownerID],
      }
    };

    if (await db.guilds.exists(guild)) {
      await db.guilds.removeGuild(guild.guildID);
      return `Successfully removed guild: **${restGuild.name}**`;
    }

    await db.guilds.addGuild(guild);
    const channel = await client.getDMChannel(restGuild.ownerID);
    await channel.createMessage('The bot is now usable in your server, run `pp help` for more information or view the above DM if you got it. Contact Dauntless#0711 (<@266432078222983169>) if you run into any issues.\n\n**Note**: All tickets are DM\'d to all bot moderators, so avoid any false reports etc.').catch((err) => console.log(err));
    return `Successfully added guild: **${restGuild.name}**`;
  }
}
