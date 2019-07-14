# Public Blog API

Open Data for Blog API. **Anyone** can use it. Every when. Every where. Good news for the Front End Engineer, you will not be bothered again to build the back end API first :muscle:

## Tech Stacks

This project developed using [Apollo Server](https://github.com/apollographql/apollo-server) and [Azure Cosmos DB](https://github.com/Azure/azure-cosmosdb-node) as the database. It means, We are already using **GraphQL**

## Introduction

The boilerplate is using **user** as the model and resolvers which is likely to be displayed in curriculum vita alongside with the **blog** management

## Dependencies

- Create user with default value `isActived` false
- Show all users with flexibly request of parameters. You just can request user based on name, email, or nothing at all
- Update user with the only one `isActived` true
- Delete user by its parameters
- Use [this library](https://github.com/okgrow/graphql-scalars) from @okgrow to use Scalar Type in GraphQL
- Upload file with GraphQL dependency. Kindly check this [link](https://github.com/jaydenseric/graphql-upload) to get the knowing of how to send the files in query of GraphQL

## License

MIT
