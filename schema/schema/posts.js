const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema = new Schema(
	{
		postType: {type: String, required: true},
		author: ObjectId,
		title: String,
		body: String,cd
		images: [String],
		audience: {type: String, default: "private"},
		reactions: [
			{
				type: {type:String,default: "like"},
				user: String!
			}
			],
		deleted: {type:Boolean, default: false}
	},
	{	collection: "posts",
		strict: false,
		autoIndex: false,
		timestamps: 
			{createdAt: 'createdAt',
			updatedAt: 'updatedAt'}
	}
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;