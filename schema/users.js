const {ApolloServer,gql} =  require('apollo-server-express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const typedef = `

type User{
	id: String!
	username: String!
	password: String!
	name: String!
	email: String!
	avatar: String!
	bio: String
	location: Location
	urls: [String]
	birthday: Date
	hometown: Location
	createdAt: Date
	updatedAt: Date
	lastLogin: Date
}

`;

const resolvers = {

User: {
		_id(u){
			return u._id.toString();
		} 
	}

};

const userSchema = new Schema({
username: {type: String, required: true},
password: {type: String, required: true},
name: {type: String, required: true},
email: {
	address: {type: String, required: true},
	verified: {type: Boolean, default:false}
	},
avatar: {type: String, default: "/media/default/avatar.jpg"},
bio: String,
location: {
	name: String,
	gps: {
	    type: {
	      type: String, 
	      default: 'Point'
	    },
	    coordinates: {
	      type: [Number],
	      default: [0,0]
	      	    }
    }
    },
urls: [String],
birthday: Date,
employer: {
	name: String,
	url: String
},
hometown: {
	name: String,
	gps: {
	    type: {
	      type: String, 
	      default: 'Point'
	    },
	    coordinates: {
	      type: [Number],
	      default: [0,0]
	      	    }
	    }
    },
lastLogin: Date
},
{
	timestamps: 
		{createdAt: 'createdAt',
		updatedAt: 'updatedAt'}
});

const User = mongoose.model("User", userSchema);

module.exports = {typedef: typedef,resolvers: resolvers, db: User};