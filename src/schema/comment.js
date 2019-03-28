const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const CommentTypeDefs = gql `

type Comment{
	"the person who commented"
	person: Person!
	"the body of the comment"
	body: String
	"Any attached media"
	media: [String]
	"Optional link preview as HTML"
	preview: String
	"Creation date"
	createdAt: Date!
	"Visible only to logged in user"
	deleted: Boolean
	}
`;

const commentResolvers = {
    Comment: {

        person: async function(u) {

            return await People.findOne({
                ukid: u.user
            });

        }

    }

}

module.exports = CommentTypeDefs;