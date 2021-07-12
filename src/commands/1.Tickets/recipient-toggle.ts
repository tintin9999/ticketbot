import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Recipient } from '../../Database/tables/Recipients';
import { Restricted } from '../decorators';
import { config } from '../../';

@Restricted({ userIDs: [...config.botMods, ...config.owners] })
export default class RecipientToggleCommand implements ICommand {
  name = 'recipient-toggle';
  aliases = ['getdms'];

  public async execute({ client, db, msg }: CommandParams): Promise<CommandOutput> {
    const recipient: Recipient = {
      userID: msg.author.id,
      channelID: await client.getDMChannel(msg.author.id).then(c => c.id)
    };
    
    if (await db.recipients.exists(recipient)) {
      await db.recipients.removeRecipient(recipient);
      return 'Successfully opted out of receiving tickets';
    } else {
      await db.recipients.addRecipient(recipient);
      return 'Successfully opted in to receiving tickets';
    }
  }
}
