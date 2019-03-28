const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const circleSchema = new Schema({
    name: String, // The human-readable name for the circle, like "Public" or "My Family"
    slug: String, // The slug/textual ID of the circle, like "public" or "my-family"
    members: [String], // The UKIDs of the members of the circle
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    collection: "circles",
    strict: false,
    autoIndex: false,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Circle = mongoose.model("Circle", circleSchema);

const circleTypeDefs = gql `
type Circle{
	"The name of the circle"
	name: String!
	"The slug of the circle"
	slug: String!
	"The members of the circle"
	members: [Person]
	"Is it deleted? (Visible only to site owner)"
	deleted: boolean
	createdAt: Date
	updatedAt: Date
}

`;

const circleResolvers = {
    Circle: {

        members: async function(u) {
            return await People.find({
                ukid: {
                    $in: u.members
                }
            })
        }

    }

}

module.exports = {
    Circle,
    circleTypeDefs,
    circleResolvers
};