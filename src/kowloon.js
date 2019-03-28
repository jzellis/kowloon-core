"use strict";

const fs = require("fs");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


class Kowloon {

    constructor() {

        Settings.findOne(function(err, settings) {
                if (err) console.log(err);
                this.settings = settings;
            }

        }

        /** This shows my infeed, compiled from other users' public and private outfeeds */

        getFeed(filters) {

            filters = filters || {
                public: true,
                private: true,
                start: settings.lastRefresh,
                end: Date.now()
            }

        }
        /** This gets one user's outfeed only */
        getFriendFeed(userId) {}
        /** This creates a post in my outfeed, either public or private */
        createPost(type, title, body, visibility, category, liveDate) {}
        /** This updates a post */
        updatePost(postId) {}
        /** This reformats the entire site to look like a Geocities page from 1998. I'm fucking kidding. */
        deletePost(postId) {}
        /** This sends my outfeed to a requester, showing only what I've allowed them to see */
        myOutfeed(userId) {}
        /** This invites another Kowloon user to view my private outfeed. You cannot request to see other users' private outfeeds, only invite them to see yours */
        sendInvite(userId) {}
        /** This processes an incoming invite to view another user's outfeed */
        getInvite(userId) {}
        /** This accepts another user's invite and adds them to my list of infeeds */
        acceptInvite(userId) {}
        /** This simply hides their invite from my UI, but I can always accept it later */
        ignoreInvite(userId) {}
        /** This rescinds an invite I've sent to another user; if they've already accepted it I'm removed from their infeeds with no notice */
        rescindInvite(userId) {}
        /** This blocks a user from viewing both my public and private outfeeds */
        blockUser(userId) {}
        /** This creates a group of outfeed viewers and adds users to it. If you choose this as your post's target, only these users will see it */
        createOutfeedGroup(users) {}
        /** This searches my subscribed friends */
        searchFriends(query) {}
        /** This returns a Kowloon user's public profile */
        getProfile(userId) {}



    }
    const k = new Kowloon();
    module.exports = k;