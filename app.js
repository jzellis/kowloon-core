const mongoose = require('mongoose');
const express = require('express');
const redis = require('redis');
const fs = require("fs");
const {ApolloServer,gql,makeExecutableSchema} =  require('apollo-server-express');
const Kowloon = require('./src/kowloon.js');
redisc = redis.createClient();
 
global.__basedir = __dirname;

mongoose.connect(Kowloon.settings.mongourl, {useNewUrlParser: true});
console.log("DB connected");

const app = express();

/* 

const typeDefs = gql(User.typedef);
const resolvers = {};

schema = makeExecutableSchema({typeDefs,resolvers});

const server = new ApolloServer(schema);

server.applyMiddleware({ app, path: '/graphql' });
*/
app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
