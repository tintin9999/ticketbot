import { ICommand, CommandParams, CommandOutput } from '../Command';
import { TicketRenderer } from '../../renderers';

export default class DeleteCommand implements ICommand {
  name = 'delete';
  aliases = ['remove', 'del', 'close'];
  help = '<ticket id> [--override]';
  public async execute({ client, msg, args, db }: CommandParams): Promise<CommandOutput> {
    if (!args[0]) {
      return 'specify a ticket ID and try again';
    }

    const override = client.opts.botMods.includes(msg.author.id);
    const ticket = await db.tickets.getTicket(args[0]);
    if (!ticket) {
      return `no ticket with ID #${args[0]}`;
    }
    if (ticket.userID !== msg.author.id && !override) {
      return 'you don\'t own this ticket.';
    }

    for (const recipient of ticket.recipients) {
      client.editMessage(recipient.channelID, recipient.messageID, {
        embed: TicketRenderer.renderTicket(ticket, await client.getRESTUser(ticket.userID), TicketRenderer.States.CLOSED, msg.author)
      }).catch(() => void 0);
    }

    await db.tickets.deleteTicket(ticket._id);

    return {
      title: `Deleted ticket #${ticket._id}`
    };
  }
}

