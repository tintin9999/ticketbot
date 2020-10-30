import { ICommand, CommandParams, CommandOutput } from '../Command';
import { EmbedOptions } from 'eris';

export default class ShowWhitelist implements ICommand {
  name = 'show-whitelist';
  aliases = ['wlls'];
  help = 'wlls';

  public async execute({
    db,
    msg,
  }: CommandParams): Promise<CommandOutput> {
    const { whitelists } = await db.guilds.get(msg.member.guild.id);
    const output: EmbedOptions = {
      title: 'Whitelist',
      fields: [],
    };
    for (const key of Object.keys(whitelists)) {
      let sep = '';
      switch (key) {
        case 'channels':
          sep = '#';
          break;
  
        case 'roles':
          sep = '@&';
          break;
  
        case 'users':
          sep = '@';
          break;
      }

      if (whitelists[key].length > 0) {
        output.fields.push({
          name: key.toUpperCase(),
          value: whitelists[key].map((v: string) => `• <${sep}${v}>`).join('\n')
        });
      }
    }
    
    if (output.fields.length === 0) {
      output.description = 'No whitelists registered, contact an admin to whitelist entities.';
    }
    
    return output;
  }
}
