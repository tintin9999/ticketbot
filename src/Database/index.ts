import { MongoClient, Db } from 'mongodb';
import Tickets from './tables/Tickets';
import Recipients from './tables/Recipients';
import { config } from '../';
import Guilds from './tables/Guilds';

export default class Database {
  private db: Db;

  public tickets: Tickets;
  public recipients: Recipients;
  public guilds: Guilds;

  public async bootstrap(): Promise<void> {
    const dbConn = await MongoClient.connect(config.keys.mongo, {
      useUnifiedTopology: true,
    });
    this.db = dbConn.db();
    this.tickets = new Tickets(this.db.collection('tickets'));
    this.recipients = new Recipients(this.db.collection('recipients'));
    this.guilds = new Guilds(this.db.collection('guilds'));
  }
}
