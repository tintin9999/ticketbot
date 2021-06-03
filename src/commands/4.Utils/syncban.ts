import { ICommand, CommandParams, CommandOutput } from '../Command';
import { User } from 'eris';
import { Restricted } from '../decorators';
import { config } from '../..';

@Restricted({ userIDs: config.owners })
export default class SyncBanCommand implements ICommand {
  name = 'syncban';
  help: 'ban someone in all servers that the bot has ban permissions in';

  public async execute({ msg, client, args }: CommandParams): Promise<CommandOutput> {
    const id = args[0];
    const reason = args.slice(0, 1).join(' ');

    if (!(reason.length <= 2)) {
      return 'You need to provide a reason.';
    }

    let user: User;
    try {
      user = await client.getRESTUser(id);
    } catch (_) {
      return `Invalid user ID.`;
    }
  
    const username = `${user.username}#${user.discriminator}`;
    const guilds = client.guilds;
    const noPerms: string[] = [];

    const message = await msg.channel.createMessage({
      embed: {
        description: `Attempting to ban \`${username}\` in **${guilds.size}** guilds...`
      },
    });

    await Promise.all(guilds.map((async (guild) => {
      try {
        await guild.banMember(user.id, 0, reason);
      } catch (error) {
        noPerms.push(guild.name);
        console.log(error.stack);
      }
    })));

    await message.edit({ 
      embed: {
        title: 'Sync-ban Completed <:check:832415939525083136>',
        description: `**${username}** (\`${user.id}\`) was banned from **${guilds.size - noPerms.length}** guilds.\n\nFailed in:\n${noPerms.join('\n')}`,
        timestamp: new Date(),
      }
    });
    return {
      description: 'done'
    };
  }
}
