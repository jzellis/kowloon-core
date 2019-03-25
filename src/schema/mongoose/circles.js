const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const circleSchema = new Schema(
	{
		name: String, // The human-readable name for the circle, like "Public" or "My Family"
		slug: String, // The slug/textual ID of the circle, like "public" or "my-family"
		members: [String] // The UKIDs of the members of the circle
		deleted: {type:Boolean, default: false}
	},
	{	collection: "circles",
		strict: false,
		autoIndex: false,
		timestamps: 
			{createdAt: 'createdAt',
			updatedAt: 'updatedAt'}
	}
);

const Circle = mongoose.model("Circle", circleSchema);

module.exports = Circle;