import { ICommand, CommandParams, CommandOutput } from '../Command';

export default class PingCommand implements ICommand {
  name = 'invite';
  alises = ['inv'];
  
  execute = ({ client }: CommandParams): CommandOutput =>
    `You can invite me to a new server using **[this link](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot)**`;
}
