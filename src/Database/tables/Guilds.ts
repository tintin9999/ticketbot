import { GenericTable, GenericEntity } from './GenericTable';

export type GuildDB = {
  guildID: string;
  ownerID: string;
  whitelists?: {
    roles?: string[];
    channels?: string[];
    users?: string[];
  };
} & GenericEntity;

export type whitelist = 'user' | 'role' | 'channel';

export type RemovedEntity = {
  type: string;
  id: string;
};

export default class Guilds extends GenericTable<GuildDB> {
  public get(guildID: GuildDB['guildID']): Promise<GuildDB> {
    return this.collection.findOne({ guildID });
  }

  public async addGuild(guild: GuildDB): Promise<void> {
    await this.collection.insertOne(guild);
  }

  public async exists(guild: GuildDB): Promise<boolean> {
    return this.collection.findOne({ guildID: guild.guildID }).then(Boolean);
  }

  public async removeGuild(guildID: GuildDB['guildID']): Promise<void> {
    await this.collection.deleteOne({ guildID });
  }

  public async getAllGuildIDs(): Promise<GuildDB['guildID'][]> {
    return this.getAll().then((guilds) => guilds.map((g) => g.guildID));
  }

  public async updateWhitelist(
    guildID: GuildDB['guildID'],
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

  public async removeWhitelist(guild: GuildDB, identity: string): Promise<RemovedEntity | null> {
    for (const key of Object.keys(guild.whitelists)) {
      if (guild.whitelists[key].includes(identity)) {
        this.collection.updateOne({ _id: guild._id }, {
          $pull: {
            [`whitelists.${key}`] : identity
          }
        });
        
        return {
          type: key,
          id: identity
        };
      }
    }
    return null;
  }
}
