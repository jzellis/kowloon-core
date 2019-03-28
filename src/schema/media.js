const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const {
    ApolloServer,
    gql
} = require('apollo-server-express');

const mediaSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    filetype: String,
    slug: String,
    // The UKID of the uploader
    uploader: String,
    encoding: {
        type: String,
        default: "UTF-8"
    },
    contents: {
        data: Buffer,
        contentType: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    collection: "media",
    strict: false,
    autoIndex: false,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Media = mongoose.model("Media", mediaSchema);

const mediaTypeDefs = gql `
type Media{
	filename: String
	filetype: String
	slug: String
	uploader: Person
	stream: String
	encoding: String
	deleted: boolean
	createdAt: Date
	updatedAt: Date
}

`;

const mediaResolvers = {
    Media: {

        uploader: async function(u) {
            return await People.find({
                ukid: u.uploader
            })
        }

    }

}

module.exports = {
    Media,
    mediaTypeDefs,
    mediaResolvers
};