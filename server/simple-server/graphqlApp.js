const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Create a server:
const app = express();

// Create a schema and a root resolver:
const schema = buildSchema(`
    type Book {
        title: String!
        author: String!
    }

    type Query {
        books: [Book]
    }
`);

const rootValue = {
    books: () => require('./strage.js').books
};

// Use those to handle incoming requests:
app.use(graphqlHTTP({
    schema,
    rootValue,
    context: ({ req }) => {
        // do something
        return {
          token: req.token,
        };
      },
}));

function hoge() {
    context.token
}

// Start the server:
app.listen(8080, () => console.log("Server started on port 8080"));
