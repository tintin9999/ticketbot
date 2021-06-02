import { ICommand, CommandParams, CommandOutput } from '../Command';

export const Restricted = ({ roleIDs = [], userIDs = [] }: {
  roleIDs?: string[];
  userIDs?: string[];
}) =>
  <T extends new (...args: any[]) => any>(Target: T): T => {
    return class extends Target implements Partial<ICommand> {
      public execute({ client, msg, ...rest }: CommandParams): CommandOutput {
        if (roleIDs.length === 0 && userIDs.length === 0) {
          throw new Error("Expected at least one filter parameter");
        }

        const guild = client.guilds.get(msg.member.guild.id);
        const member = guild.members.get(msg.author.id);

        if (
          !userIDs.includes(msg.author.id) &&
          !(member && member.roles.some(roleID => roleIDs.includes(roleID)))
        ) {
          return null;
        }

        return super.execute({ client, msg, ...rest });
      }
    };
  };
