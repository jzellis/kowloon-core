const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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

module.exports = User;