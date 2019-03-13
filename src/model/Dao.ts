import { Container, CosmosClient, Database, SqlParameter, SqlQuerySpec } from '@azure/cosmos';

export default class Dao {
  public client: CosmosClient;
  public databaseId: string;
  public collectionId: string;
  public database: Database;
  public container: Container;
  public query: string;
  public parameters: SqlParameter[];

  constructor(cosmosClient: CosmosClient, databaseId: string, containerId: string) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;

    this.database = null;
    this.container = null;
  }

  async init() {
    console.log('Setting up database user...');
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId
    });
    this.database = dbResponse.database;
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId
    });
    this.container = coResponse.container;

    console.log('Setting up the container user... done');
  }

  async find(querySpec: SqlQuerySpec) {
    if (!this.container) {
      throw new Error('User collection is not initialized');
    }
    const { result: results } = await this.container.items.query(querySpec).toArray();
    return results;
  }
}
