import Handler from './Handler';
import { MessageContent } from 'eris';
import { config } from '../../../../';

const iOSDoubleHyphen = /—/g;

export const handleCommand: Handler = async function (msg) {
  if (msg.author.bot) {
    return null;
  }

  if (!msg.content.toLowerCase().startsWith(this.opts.prefix)) {
    return null;
  }

  if (!config.owners.includes(msg.author.id)) {
    const guildIDs = await this.context.db.guilds.getAllGuildIDs();
    if (msg.channel.type !== 0 || !guildIDs.includes(msg.channel.guild.id)) {
      return null;
    }

    const guild = await this.context.db.guilds.get(msg.member.guild.id);
    const {
      channels: whitelistedChannels = [],
      roles: whitelistedRoles = [],
      users: whitelistedUsers = []
    } = guild.whitelists;

    const bypass = whitelistedUsers.includes(msg.author.id);

    if (
      whitelistedRoles.every((roleID) => !msg.member.roles.includes(roleID)) &&
      !bypass
    ) {
      return null;
    }

    if (
      whitelistedChannels.every(
        (channelID) =>
          msg.channel.id !== channelID &&
          (msg.channel as any).parentID !== channelID
      ) &&
      !bypass
    ) {
      return null;
    }
  }

  const [commandName, ...args] = msg.content
    .slice(this.opts.prefix.length)
    .replace(iOSDoubleHyphen, '--')
    .split(/ +/g);
  const command = this.commands.get(commandName);
  if (!command) {
    return null;
  }

  try {
    const res = await command.execute({
      msg,
      args,
      ...this.context
    });

    if (res) {
      const opts: MessageContent = {};
      if (typeof res === 'string') {
        if (command.raw) {
          opts.content = res;
        } else {
          opts.embed = { description: res };
        }
      } else {
        opts.embed = res;
      }

      await msg.channel.createMessage(opts);
    }
  } catch (err) {
    console.error(err.stack);
    msg.channel.createMessage({
      embed: {
        color: 0xca2d36,
        title: 'oh no',
        description: `\`\`\`js\n${err.message}\n\`\`\``
      }
    });
  }
};
