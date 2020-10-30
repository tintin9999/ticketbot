import Event from '../Event';
import { Message } from 'eris';
import * as handlers from './handlers';

export const onMessageCreate: Event = {
  packetName: 'messageCreate',
  async handler(msg: Message) {
    if (msg.author.bot) {
      return;
    }

    const guilds = await this.context.db.guilds.getAllGuildIDs();

    if (
      msg.channel.type === 0 &&
      !guilds.includes(msg.channel.guild.id)
    ) {
      return;
    }

    for (const handler of Object.values(handlers)) {
      await handler.call(this, msg);
    }
  },
};
