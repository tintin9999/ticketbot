/* eslint-disable @typescript-eslint/camelcase */
import Handler from './Handler';
import { loadConfig } from '../../../../lib/util';
const config = loadConfig();

export const ModCommands: Handler = async function (msg) {
  if (msg.guildID !== config.guild.ID) {
    return null;
  }

  if (msg.channel.id !== config.guild.cmdChannel) {
    return null;
  }

  if (msg.author.id !== '270904126974590976') { // donk memer
    return null;
  }

  const embed = msg.embeds[0];
  if (!embed) {
    return null;
  }

  if (embed.fields.length === 0) {
    return null;
  }

  if (!embed.fields[0].name.includes('trades')) {
    return null;
  }

  const toSend = embed.fields[0].value.split('\n');

  if (toSend.length <= 3) {
    return null;
  }

  const description = toSend.join(' ');
  msg.channel.createMessage({
    embed: {
      title: 'Formatted IDs',
      description,
      timestamp: new Date(),
    },
  });
  return null;
};
