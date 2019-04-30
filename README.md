### CosmosDB with GraphQL

GraphQL is a powerful tool to satisfy the front end for them to manipulate the returned data in the client. Also CosmosDB is also a powerful tool to satisfy the back end to manipulate the request data from the client. But it's so daunting to combine them as a full pack server. So this boilerplate comes to solve that daunting process

### Use Case

The boilerplate is using **user** as the model and resolvers which is likely to be displayed in *curriculum vitae*

Dependencies
--------

* Create user with default value `isActived` false
* Show all users with flexibly request of parameters. You just can request user based on name, email, or nothing at all
* Update user with the only one `isActived` true
* Delete user by its parameters
* Use [this library](https://github.com/okgrow/graphql-scalars) from @okgrow to use Scalar Type in GraphQL

License
--------

    Copyright 2019 Dito Hafizh Indriarto

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
    documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
    and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of 
    the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
    THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
    CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
    IN THE SOFTWARE.
 