const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const {
    ApolloServer,
    gql
} = require('apollo-server-express');


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        address: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    avatar: {
        type: String,
        default: "/media/default/avatar.jpg"
    },
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
                default: [0, 0]
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
                default: [0, 0]
            }
        }
    },
    lastLogin: Date
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const User = mongoose.model("User", userSchema);

const userTypeDefs = gql `
type User{
"ID of the user. (Logged-in user only)"
_id: String
username: String!
name: String
email: String!
// The user's avatar
avatar: String!
// The user's bio
bio: String
// The user's current location
location: Location
// The user's URLs
urls: [String]
birthday: Date
employer: String
employerUrl: String
hometown: Location
lastLogin: Date
createdAt: Date
updatedAt: Date

`;

const userResolvers = {

    User: {

        email: function(i) {
            return i.email.address
        },
        employer: function(i) {
            return i.employer.name
        },
        employerUrl: function(i) {
            return i.employer.url
        },
        location: function(i) {
            return {
                name: i.location.name,
                coordinates: i.location.gps.coordinates
            }
        }
    }

}

module.exports = {
    User,
    userTypeDefs,
    userResolvers
};
