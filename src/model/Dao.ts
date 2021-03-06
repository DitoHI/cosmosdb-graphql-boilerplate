import { Container, CosmosClient, Database, SqlQuerySpec } from '@azure/cosmos';

export default class Dao {
  public client: CosmosClient;
  public databaseId: string;
  public collectionId: string;
  public database: Database;
  public container: Container;

  constructor(
    cosmosClient: CosmosClient,
    databaseId: string,
    containerId: string
  ) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;

    this.database = null;
    this.container = null;
  }

  async init() {
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId
    });
    this.database = dbResponse.database;

    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId
    });
    this.container = coResponse.container;
  }

  async find(querySpec: SqlQuerySpec) {
    if (!this.container) {
      throw new Error('The collection is not initialized');
    }
    const { result: results } = await this.container.items
      .query(querySpec)
      .toArray();
    return results;
  }

  async addItem(item: any) {
    return this.container.items
      .create(item)
      .then(result => {
        return result.body;
      })
      .catch(err => {
        return err;
      });
  }

  async updateItem(id: string, item: any) {
    return this.getItem(id).then(doc => {
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
        .then(result => {
          return result.body;
        })
        .catch(err => {
          return err;
        });
    });
  }

  async getItem(id: string) {
    return this.container
      .item(id)
      .read()
      .then(result => {
        return result.body;
      })
      .catch(err => {
        return err;
      });
  }

  async deleteItem(id: string) {
    return this.getItem(id).then(result => {
      if (!result) {
        return new Error('No item found');
      }

      this.container
        .item(id)
        .delete()
        .catch(err => {
          return new Error(err);
        });
    });
  }
}
