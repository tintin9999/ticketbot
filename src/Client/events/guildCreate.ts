import Event from './Event';
import { Guild } from 'eris';
import { config } from '../..';
import { basicHelp } from '../../Constants';

export const onGuildCreate: Event = {
  packetName: 'guildCreate',
  async handler(guild: Guild) {
    const channel = await this.getDMChannel(guild.ownerID);
    const { id, token } = config.guildLogger;
    try {
      await channel.createMessage({
      embed: {
        title: 'Thanks for inviting the bot',
        description: `**Use \`pp request\` to request usage of the bot.** After that, only **you** can run these commands to whitelist certain roles/channels so that the bot will work for your moderators, run \`pp help\` if you need more info:\n\n${basicHelp.join('\n')}`
      }
    });
  } catch (err) {
    this.executeWebhook(id, token, {
      content: `Failed to DM owner of server (\`${guild.name}\`): <@${channel.recipient.id}>. Error: \`${err.message}\``
    });
  }

    this.executeWebhook(id, token, {
      embeds: [
        {
          title: 'Joined new guild',
          description: `Guild name: ${guild.name}\nGuild ID: \`${guild.id}\`\nMembers: \`${guild.memberCount}\`\nOwner: <@${guild.ownerID}>`,
          timestamp: new Date(),
        }
      ]
    });
    return null;
  }
};
