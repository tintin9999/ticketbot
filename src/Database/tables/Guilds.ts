import { GenericTable, GenericEntity } from './GenericTable';

export type Guild = {
  guildID: string;
  ownerID: string;
  whitelists?: {
    roles: string[];
    channels: string[];
    users: string[];
  };
} & GenericEntity;

export type whitelist = 'user' | 'role' | 'channel';

export default class Guilds extends GenericTable<Guild> {
  public get(guildID: Guild['guildID']): Promise<Guild> {
    return this.collection.findOne({ guildID });
  }

  public async addGuild(guild: Guild): Promise<void> {
    await this.collection.insertOne(guild);
  }

  public async exists(guild: Guild): Promise<boolean> {
    return this.collection.findOne({ guildID: guild.guildID }).then(Boolean);
  }

  public async removeGuild(guildID: Guild['guildID']): Promise<void> {
    await this.collection.deleteOne({ guildID });
  }

  public async getAllGuilds(): Promise<Guild['guildID'][]> {
    return this.getAll().then((guilds) => guilds.map((g) => g.guildID));
  }

  public async updateWhitelist(
    guildID: Guild['guildID'],
    wlType: whitelist,
    wlEntity,
  ): Promise<boolean> {

    this.collection.updateOne(
      { guildID },
      { $addToSet: {
        [`whitelists.${wlType}s`]: wlEntity
      } },
    );

    return false;
  }
}
