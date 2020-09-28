import Handler from './Handler';
import { commands } from '../../../../commands';
import { MessageContent } from 'eris';
import { config } from '../../../../';

const iOSDoubleHyphen = /—/g;
const whitelistedRoles = [config.roles.lonAdmin, config.roles.lonTesters, config.roles.dvMod, config.roles.dvAdmin, config.roles.tdkMod, config.roles.tdkAdmin];
const whitelistedChannels = [
  config.channels.lonBotCat,
  config.channels.lonTestCat,
  config.channels.tdkModCat,
  config.channels.dvModCat
];

export const handleCommand: Handler = async function (msg) {
  if (msg.channel.type !== 0) {
    return;
  }

  if (!this.opts.guildIDs.includes(msg.channel.guild.id)) {
    return;
  }

  if (whitelistedRoles.every((roleID) => !msg.member.roles.includes(roleID))) {
    return;
  }

  if (
    whitelistedChannels.every(
      (channelID) =>
        msg.channel.id !== channelID &&
        (msg.channel as any).parentID !== channelID,
    )
  ) {
    return;
  }

  if (!msg.content.toLowerCase().startsWith(this.opts.prefix)) {
    return;
  }

  const [commandName, ...args] = msg.content
    .slice(this.opts.prefix.length)
    .replace(iOSDoubleHyphen, '--')
    .split(/ +/g);
  const command = commands.get(commandName);
  if (!command) {
    return;
  }

  try {
    const res = await command.execute({
      msg,
      args,
      ...this.context,
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
        description: `\`\`\`js\n${err.message}\n\`\`\``,
      },
    });
  }
};
