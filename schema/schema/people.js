const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const peopleSchema = new Schema(
	{
	ukid: String, // The unique Kowloon ID of the user's install
	url: String,
	following: {type:Boolean, default:true},
	follower: {type:Boolean, default: false},
	username: String,
	name: String,
	email: String,
	avatar: String,
	outgoingInvite: { hash: String, dateSent: Date, dateAccepted: Date},
	incomingInvite: { hash: String, dateSent: Date, dateAccepted: Date},
	blocked: {type: Boolean, default: false},
	muted: {type: Boolean, default: false},
	},
	{	collection: "people",
	autoIndex: false,
	strict: false,
		timestamps: 
			{createdAt: 'createdAt',
			updatedAt: 'updatedAt'}
	}
);

const People = mongoose.model("People", peopleSchema);

module.exports = People;