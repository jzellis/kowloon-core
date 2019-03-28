const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const {
    ApolloServer,
    gql
} = require('apollo-server-express');



const peopleSchema = new Schema({
    ukid: String, // The unique Kowloon ID of the person's Kowloon instance -- every Kowloon has one
    url: String, // The URL of their Kowloon instance
    following: {
        type: Boolean,
        default: true
    }, // Are you following them?
    follower: {
        type: Boolean,
        default: false
    }, // Are they following you?
    username: String, // Their username, updated when you pull from their instance
    name: String,
    email: String,
    avatar: String,
    outgoingInvite: {
        hash: String,
        dateSent: Date,
        dateAccepted: Date
    }, // The hash for your invite to them to view your private feed, if you'v sent one
    incomingInvite: {
        hash: String,
        dateSent: Date,
        dateAccepted: Date
    }, // The hash they sent you to view their private feed
    blocked: {
        type: Boolean,
        default: false
    },
    muted: {
        type: Boolean,
        default: false
    },
}, {
    collection: "people",
    autoIndex: false,
    strict: false,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const People = mongoose.model("People", peopleSchema);

const peopleTypeDefs = gql `

type Person{

	ukid: String
	url: String
	"Logged in user only"
	following: Boolean
	follower: Boolean
	username: String
	name: String
	"Logged in user only"
	email: String
	avatar: String
	"logged in user only"
	blocked: Boolean
	"logged in user only"
	muted: Boolean
	"Logged in user only"
	circles: [Circle]


}`;
const peopleResolvers = {};
module.exports = {
    People,
    peopleTypeDefs,
    peopleResolvers
};