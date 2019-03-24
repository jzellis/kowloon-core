const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const Kowloon = class {
	
	this.settings = {};
	
	constructor(){
	
	this.settings = Settings.findOne({});
	
	}
	/** This shows my infeed, compiled from other users' public and private outfeeds */
	this.getFeed = function (filters) {
	
	filters = filters || {
		public: true,
		private: true,
		start: this.settings.lastRefresh,
		end: Date.now()
		}
	
	}
	/** This gets one user's outfeed only */
	this.getFriendFeed = function(userId) {}
	/** This creates a post in my outfeed, either public or private */
	this.createPost = function(type,title,body,visibility,category,liveDate) {}
	/** This updates a post */
	this.updatePost = function(postId) {}
	/** This reformats the entire site to look like a Geocities page from 1998. I'm fucking kidding. */
	this.deletePost = function(postId)
	/** This sends my outfeed to a requester, showing only what I've allowed them to see */
	this.myOutfeed = function(userId) {}
	/** This invites another Kowloon user to view my private outfeed. You cannot request to see other users' private outfeeds, only invite them to see yours */
	this.sendInvite = function(userId) {}
	/** This processes an incoming invite to view another user's outfeed */
	this.getInvite = function(userId) {}
	/** This accepts another user's invite and adds them to my list of infeeds */
	this.acceptInvite = function(userId) {}
	/** This simply hides their invite from my UI, but I can always accept it later */
	this.ignoreInvite = function(userId) {}
	/** This rescinds an invite I've sent to another user; if they've already accepted it I'm removed from their infeeds with no notice */
	this.rescindInvite = function(userId) {}
	/** This blocks a user from viewing both my public and private outfeeds */
	this.blockUser = function(userId) {}
	/** This creates a group of outfeed viewers and adds users to it. If you choose this as your post's target, only these users will see it */
	this.createOutfeedGroup(users) = function() {}
	/** This searches my subscribed friends */
	this.searchFriends(query){}
	/** This returns a Kowloon user's public profile */
	this.getProfile(userId);


}

module.exports = Kowloon;