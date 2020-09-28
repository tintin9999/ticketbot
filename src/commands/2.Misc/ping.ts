import { ICommand, CommandParams, CommandOutput } from '../Command';

export default class PingCommand implements ICommand {
  name = 'ping';
  execute = ({ client }: CommandParams): CommandOutput =>
    `API latency: ${client.shards.get(0).latency}ms`;
}
