const { ApolloServer, gql, getScope } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');
const GraphQLJSON = require('graphql-type-json');


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  scalar Date
  scalar Odd
  scalar JSON

  type MyType {
    oddValue: Odd
  }

  type Event {
    id: ID!
    date: Date!
  }

  type MyObject {
    myField: JSON
  }

  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  # This "Book" type defines the queryable fields for every book in our data source.
  "Book type"
  type Book {
    """
    book title
    """
    title: String
    author: Author
  }

  type Author {
    name: String
    books: [Book]
  }

  type Post {
    title: String
    body: String
    mediaUrls: [String]
  }

  type User {
    name: String
  }

  union Result = Book | Author

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    authors: [Author]
    search(contains: String): [Result]
    favoriteColor: AllowedColor # enum return value
    avatar(borderColor: AllowedColor): String # enum argument
    events: [Event!]
    odd(isOdd: Boolean): Odd
    objects: [MyObject]
  }

  type Mutation {
    addBook(title: String, author: String): Book,
    # createPost(title: String, body: String, mediaUrls: [String]): Post,
    createPost(post: PostAndMediaInput): Post,
  }

  input PostAndMediaInput {
    title: String
    body: String
    mediaUrls: [String]
  }

  enum AllowedColor {
    RED
    GREEN
    BLUE
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type UpdateUserEmailMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }
`;

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

const oddValue = (value) => {
  return value % 2 === 1 ? value : null
}

const oddScalar = new GraphQLScalarType({
  name: 'Odd',
  description: 'Odd custom scalar type',
  serialize: oddValue,
  parseValue: oddValue,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return oddValue(parseInt(ast.value, 10));
    }
    return null;
  },
});

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  AllowedColor: {
    RED: '#f00',
    GREEN: '#0f0',
    BLUE: '#00f',
  },
  Date: dateScalar,
  Odd: oddScalar,
  JSON: GraphQLJSON,
  Result: {
    __resolveType(obj, context, info){
      // console.log(obj);
      // console.log(context);
      // console.log(info);
      if(obj.name){
        return 'Author';
      }
      if(obj.title){
        return 'Book';
      }
      return null; // GraphQLError is thrown
    },
  },
  Book: {

    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent) {
      return {
        name: parent.author
      };
    }
  },
  Query: {
    // books: () => books,
    books: () => require('./strage.js').books,
    authors: () => require('./strage.js').authors,
    favoriteColor: () => {
      return "AllowedColor.RED";
    },
    avatar: (parent, args) => {
      return "RED";
    },
    search: () => require('./strage.js').books,
    events() {
      return [{id: "hioajdsfas", date: new Date()}]
    },
    odd: (parent, args) => {
      return args.isOdd ? 11 : 10
    }
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    authScope: getScope(req.headers.authorization)
  })
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

const f = () => {
  let fs = require("fs");
}

// const oddValue = (value) => {
//   return value % 2 === 1 ? value : null
// }