import { ICommand, CommandParams, CommandOutput } from '../Command';
import { User } from 'eris';
import { Restricted } from '../decorators';
import { config } from '../..';

@Restricted({ userIDs: config.botMods })
export default class SyncBanCommand implements ICommand {
  name = 'syncban';
  help: 'ban someone in all servers that the bot has ban permissions in';

  public async execute({ msg, client, args }: CommandParams): Promise<CommandOutput> {
    const reason = `Breaking Bot Rules/Discord TOS. Authorized by ${msg.author.username}#${msg.author.discriminator} (\`${msg.author.id}\`).`;
    const id = args[0];

    if (!id) {
      return 'you need to include a user ID';
    }

    let user: User;
    try {
      user = await client.getRESTUser(id);
    } catch (_) {
      return `\`${id}\` isn't a valid user ID.`;
    }
  
    const username = `${user.username}#${user.discriminator}`;
    const guilds = client.guilds;
    const noPerms: string[] = [];

    const message = await msg.channel.createMessage({
      embed: {
        description: `Attempting to ban **${username}** in **${guilds.size}** guilds...`
      },
    });

    await Promise.all(guilds.map((async (guild) => {
      try {
        await guild.banMember(user.id, 0, reason);
      } catch (error) {
        noPerms.push(guild.name);
        console.log(error.message);
      }
    })));

    await message.edit({ 
      embed: {
        title: 'Sync-ban Completed <:check:832415939525083136>',
        description: `**${username}** (\`${user.id}\`) was banned from **${guilds.size - noPerms.length}** servers.\n\nFailed in:\n${noPerms.join(', ')}`,
        timestamp: new Date(),
      }
    });
    return null;
  }
}
