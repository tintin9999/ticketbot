import Handler from './Handler';
const guildIDs = ['470337009886429194', '820181861740838932']; // DMO and Bot Moderation servers

export const handleUsageCommand: Handler = async function (msg) {
  const usageRegex = /Command usage for \*\*(?<username>[\w ]+#\d{4})\*\* (?<userID>\d{15,21}): (?<link>https:\/\/hastepaste.com\/view\/.*)/g;

  if (msg.author.id !== '270904126974590976') {
    return null;
  }

  if (msg.channel.type !== 0) {
    return null;
  }

  if (!guildIDs.includes(msg.channel.guild.id)) {
    return null;
  }

  usageRegex.lastIndex = 0;
  const res = usageRegex.exec(msg.content);
  if (!res) {
    return null;
  }

  const { username, link } = res.groups;
  try {
    const commandRes = await this.commands.get('usage').execute({ msg, args: [link], ...this.context });
    await msg.channel.createMessage({
      embed: {
        ...(commandRes as object),
        title: `Command usage for ${username}`
      }
    });
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
