const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const DateTypeDefs = gql `

scalar Date

type MyType {
   created: Date
}
`;

module.exports = DateTypeDefs;