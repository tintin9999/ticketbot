import Event from '../Event';
import { Message } from 'eris';
import * as handlers from './handlers';
import { config } from '../../..';

export const onMessageCreate: Event = {
  packetName: 'messageCreate',
  async handler(msg: Message) {

    const guilds = await this.context.db.guilds.getAllGuildIDs();

    if (
      msg.channel.type === 0 &&
      !guilds.includes(msg.channel.guild.id) &&
      !config.owners.includes(msg.author.id)
    ) {
      return;
    }

    for (const handler of Object.values(handlers)) {
      await handler.call(this, msg);
    }
  },
};
