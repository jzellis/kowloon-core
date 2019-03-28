const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const LocationTypeDefs = gql `

type Location{
	"The human readable name of the location."
	name: String
	"the coordinates as an array of [longitude,latitude]."
	coordinates: [Float]
	}
`;

module.exports = LocationTypeDefs;