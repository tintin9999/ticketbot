import Event from './Event';
import { Guild } from 'eris';
import { config } from '../..';

export const onGuildDelete: Event = {
  packetName: 'guildDelete',
  async handler(guild: Guild) {
    const { id, token } = config.guildLogger;
    this.executeWebhook(id, token, {
      embeds: [
        {
          title: 'Left Guild',
          description: `Guild name: ${guild.name}\nGuild ID: \`${guild.id}\`\nOwner: <@${guild.ownerID}>`,
          timestamp: new Date(),
        }
      ]
    });
    return null;
  }
};
