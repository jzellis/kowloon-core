const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const {
    ApolloServer,
    gql
} = require('apollo-server-express');


const postSchema = new Schema({
    postType: {
        type: String,
        default: "post"
    }, // The type of post this is
    author: ObjectId, // For now, this will default to the single user, but that could change
    title: String, // If the post has a title
    slug: String, // The URL-friendly slug for this post -- defaults to the post's ID unless there's a title
    body: String,
    media: [String], // This is for gallery type posts
    includeCircle: {
        type: String,
        default: "private"
    }, // Which circle is it published to?
    excludeCircle: {
        type: String,
        default: "public"
    }, // Which circle is it published to?

    reactions: [{
        type: {
            type: String,
            default: "like"
        }, // Reacts
        user: String, // The UKID of the user who reacted
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    comments: [{
        body: String, // Reacts
        user: String, // The UKID of the user who reacted
        media: String, // The URI of any attached media
        linkPreview: { // If the comment has a link, here's the preview object
            title: String,
            image: String,
            excerpt: String
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            deleted: {
                type: Boolean,
                default: false
            }
        }
    }],

    metadata: {
        commentsAllowed: {
            type: Boolean,
            default: true
        },
        commentsBy: {
            type: String,
            default: "private"
        }, // The circle who can comment
        reactionsAllowed: {
            type: Boolean,
            default: true
        },
        reactsBy: {
            type: String,
            default: "private"
        } // The circle who can react		
    },
    sharedFrom: {
        originalPoster: String,
        originalId: String,
        originalUri: String,
        originalDate: Date
    },
    checkIn: {
        name: String,
        gps: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        }
    },

    status: {
        type: String,
        default: "draft"
    },
    publishedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    collection: "posts",
    strict: false,
    autoIndex: false,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const postTypeDefs = gql `
type Post{
		"The _id of the post. (Logged-in user only)"
		_id: String
		"The type of the post."		
		postType: String!
		"The optional post title"
		title: String
		"The post slug"
		slug: String
		"The post body"
		body: String
		"Media attached to the post"
		media: [Media]
		"Reactions to the post"
		reactions: [Reaction]
		"Post comments"
		comments: [Comment]
		"is this a repost?"
		isShared: Boolean
		"If it was shared, who shared it?"
		originalPoster: Person
		"if it was shared, what was the original URI?"
		originalUri: String
		"Optional checkin"
		checkIn: Location
		publishedAt: Date
		"are comments-allowed? (Logged-in user only)"
		commentsAllowed: Boolean
		"Which circle can comment? (Logged-in user only)"
		commentsBy: String
		"are  reactions allowed? (Logged-in user only)"
		reactionsAllowed: Boolean
		"Which circle can react? (Logged-in user only)"
		reactsBy: String
		"post status (logged-in user only)"
		status: String
		"Post creation date (logged-in user only)"
		createdAt: Date
		"Last edit (visible to all viewers)"
		updatedAt: Date
}

`;

const postResolvers = {

    checkin: function(i) {
        return {
            name: i.location.name,
            coordinates: i.location.gps.coordinates
        }
    }


};

const Post = mongoose.model("Post", postSchema);

module.exports = {
    Post,
    postTypeDefs,
    postResolvers
};