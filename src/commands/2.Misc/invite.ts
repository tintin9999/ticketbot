import { ICommand, CommandParams, CommandOutput } from '../Command';
import { config } from '../../';

export default class PingCommand implements ICommand {
  name = 'invite';
  alises = ['inv'];
  
  execute = ({ client }: CommandParams): CommandOutput =>
    `You can invite me to a new server using **[this link](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)**. You need to contact one of the following owners to make the bot usable in your server after:\n\n${config.owners.map((id) => `<@${id}>`).join(' ')} or the server owner can use \`pp request\``;
}
