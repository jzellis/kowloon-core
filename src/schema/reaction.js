const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const ReactionTypeDefs = gql `

type Reaction{
	"the person who reacted"
	person: Person!
	"the type of reaction"
	type: String!
	"Creation date"
	createdAt: Date!
	}
`;

const reactionResolvers = {
    Reaction: {

        person: async function(u) {

            return await People.findOne({
                ukid: u.user
            });

        }

    }

}


module.exports = ReactionTypeDefs;