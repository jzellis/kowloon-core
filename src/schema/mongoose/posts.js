const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema = new Schema(
	{
		postType: {type: String, default: "post"}, // The type of post this is
		author: ObjectId, // For now, this will default to the single user, but that could change
		title: String, // If the post has a title
		slug: String, // The URL-friendly slug for this post -- defaults to the post's ID unless there's a title
		body: String,
		media: [String], // This is for gallery type posts
		circle: {type: String, default: "private"}, // Which circle is it published to?
		reactions: [
			{
				type: {type:String,default: "like"}, // Reacts
				user: String!, // The UKID of the user who reacted
				createdAt: {type: Date, default: Date.now()}
			}
			],
		comments: [
			{
				body: String, // Reacts
				user: String!, // The UKID of the user who reacted
				media: String // The URI of any attached media
				linkPreview: { // If the comment has a link, here's the preview object
				title: String,
				image: String,
				excerpt: String
				},
				createdAt: {type: Date, default: Date.now()}
			}
			],
			
		metadata: {
			commentsAllowed: {type: Boolean, default: true},
			commentsBy: {type:String, default: "private"} // The circle who can comment
			reactionsAllowed: {type: Boolean, default: true},
			reactsBy: {type:String, default: "private"} // The circle who can react		
		},
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