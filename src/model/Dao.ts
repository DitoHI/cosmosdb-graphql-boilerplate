import { Container, CosmosClient, Database, SqlParameter, SqlQuerySpec } from '@azure/cosmos';

export default class Dao {
  public client: CosmosClient;
  public databaseId: string;
  public collectionId: string;
  public database: Database;
  public container: Container;

  constructor(cosmosClient: CosmosClient, databaseId: string, containerId: string) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;

    this.database = null;
    this.container = null;
  }

  async init() {
    console.log('Setting up database...');
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId
    });
    this.database = dbResponse.database;
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId
    });
    this.container = coResponse.container;

    console.log('Setting up the container... done');
  }

  async find(querySpec: SqlQuerySpec) {
    if (!this.container) {
      throw new Error('The collection is not initialized');
    }
    const { result: results } = await this.container.items.query(querySpec).toArray();
    return results;
  }

  async addItem(item: any) {
    return this.container.items
      .create(item)
      .then((result) => {
        return result.body;
      })
      .catch((err) => {
        return err;
      });
  }

  async updateItem(id: string, item: any) {
    return this
      .getItem(id)
      .then((doc) => {
        if (doc == null) {
          return new Error('Data not found');
        }

        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            doc[key] = item[key];
          }
        }

        return this.container
          .item(id)
          .replace(doc)
          .then((result) => {
            return result.body;
          })
          .catch((err) => {
            return err;
          });
      });
  }

  async getItem(userId: string) {
    return this.container
      .item(userId)
      .read()
      .then((result) => {
        return result.body;
      })
      .catch((err) => {
        return err;
      });
  }

  async deleteItem(userId: string) {
    return this
      .getItem(userId)
      .then((result) => {
        if (result == null) {
          return new Error('No user found');
        }

        this.container
          .item(userId)
          .delete()
          .catch((err) => {
            return new Error(err);
          });
      });
  }
}
