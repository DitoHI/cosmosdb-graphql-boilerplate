'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
class Dao {
  constructor(cosmosClient, databaseId, containerId) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;
    this.database = null;
    this.container = null;
  }
  init() {
    return __awaiter(this, void 0, void 0, function*() {
      const dbResponse = yield this.client.databases.createIfNotExists({
        id: this.databaseId
      });
      this.database = dbResponse.database;
      const coResponse = yield this.database.containers.createIfNotExists({
        id: this.collectionId
      });
      this.container = coResponse.container;
    });
  }
  find(querySpec) {
    return __awaiter(this, void 0, void 0, function*() {
      if (!this.container) {
        throw new Error('The collection is not initialized');
      }
      const { result: results } = yield this.container.items
        .query(querySpec)
        .toArray();
      return results;
    });
  }
  addItem(item) {
    return __awaiter(this, void 0, void 0, function*() {
      return this.container.items
        .create(item)
        .then(result => {
          return result.body;
        })
        .catch(err => {
          return err;
        });
    });
  }
  updateItem(id, item) {
    return __awaiter(this, void 0, void 0, function*() {
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
    });
  }
  getItem(id) {
    return __awaiter(this, void 0, void 0, function*() {
      return this.container
        .item(id)
        .read()
        .then(result => {
          return result.body;
        })
        .catch(err => {
          return err;
        });
    });
  }
  deleteItem(id) {
    return __awaiter(this, void 0, void 0, function*() {
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
    });
  }
}
exports.default = Dao;
//# sourceMappingURL=Dao.js.map
