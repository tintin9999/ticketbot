import { ICommand, CommandParams, CommandOutput } from '../Command';
import { TicketRenderer } from '../../renderers';
import { escapeMarkdown } from '../../lib/util';

export default class ViewCommand implements ICommand {
  name = 'view';
  help = '<ticket id>';
  raw = true;

  public async execute({ client, db, args }: CommandParams): Promise<CommandOutput> {
    const ticket = await db.tickets.getTicket(args[0]);
    if (!ticket) {
      return `I couldn't find a ticket with ID ${args[0]}`;
    }

    const user = await client.getRESTUser(ticket.userID);
    return args.includes('--raw')
      ? escapeMarkdown(ticket.content)
      : TicketRenderer.renderTicket(ticket, user, TicketRenderer.States.OPEN);
  }
}