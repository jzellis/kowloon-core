# Kowloon
### Kowloon is a new kind of decentralized social network and publishing platform.

## Summary

Kowloon is a decentralized publishing platform and social network designed to sidestep both the privacy/ethical limitations of existing social networks as well as the problems inherent in [Metcalfe's Law](https://en.m.wikipedia.org/wiki/Metcalfe's_law) (namely, that a network's value is proportional to the square of the number of connected users; conversely, a network with no users is worthless).

It serves as both a simple personal publishing platform and a sort of social/antisocial network, which allows users to essentially ignore anything they don't wish to see and strictly control what access they choose to give to others.

## Model

Unlike other open source social networks such as Mastodon or Diaspora, a Kowloon server is not itself a social network with a set of users; instead, it is merely a single user's profile or "wall". A user's public posts to their Kowloon are visible to anyone, while their private posts are essentially only visible to people they've given access to. The public feed of a Kowloon instance looks like a social network user's public wall, though Kowloon provides richer posting and post type capabilities than most social networks (a post can have rich formatting and a title, or simply be a Twitter-like short status; the timeline renderer adjusts its output accordingly) -- perhaps a blog is a better example.

## Friendship models

A Kowloon user cannot create a symmetrical two-way "friend request" with another user; they can only invite another user to view their private feed. If User A sends such an invite to User B, they are allowing User B to see their private timeline... but they won't see User B's private timeline unless User B also invites them to do so. This sidesteps some of the simpler awkward side effects of the social network model, where seeing another user's posts also gives them access to one's own. This establishes what is, in my mind, a more polite model of interaction.

Kowloon provides users with "circles" to add other users to. Anyone can view posts marked for one's "public" circle; a default "private" circle is also created which one can add users to, but one can also create circles with specific friends (for example, family members) and any post can be targeted to either include or exclude those friends. For example, one can choose to only target a private post to family members, or to explictly hide it from family members only.

In addition, each user can create public "lists" of recommended users they follow. Another user can instantly follow the public timelines of every user on a list, or invite them to view their private feeds.

## Granular privacy controls

Every post on Kowloon has its own explicit privacy settings. It can be targeted to the public, to all private friends or to circles as mentioned above, but one can also choose to allow/disallow comments and reactions entirely on any given post, or only allow certain circles to comment and react. (There are, of course, default settings one can leave this on).

## Data ownership

All data for a Kowloon is stored locally and the user has complete control over their data. They can export it as they choose in JSON format. No other user or site has access to this data unless the user explicitly allows it.

## Ephemeral chat
Kowloon's built in chat server does not store messages. All messages disappear when the user closes their chat client and are erased from the system. Kowloon does not have any access to chat logs. When it's gone, it's gone (though users can copy/paste text, save media from chats or screenshot them).

## Architecture
Kowloon uses a Node/MongoDB/Redis/GraphQL stack on the backend and a mesh architecture for interacting with other servers. The initial client will be built using an Express/Vue stack, but the platform is client-agnostic; the primary focus is the API itself.

Each Kowloon has a unique identifier or "UKID", similar to a PGP public signature. When User A receives an invite from User B, they receive a public/private key pair from User B which serves as a permission authenticator for accessing the posts that User B has allowed them to view via adding them to a circle, as well as metadata about User B's Kowloon server instance (URI, etc.).

When a user views or refreshes their timeline, the server requests posts from all of the Kowloon users they're following and assembles them in reverse chronological order in Redis for fast caching and updating -- one's timeline is never stored permanently within one's database. In essence, each server functions like an individual user's entry in a "walled garden" model social network. This call also updates metadata about the users one is following, if anything has changed.

## Current status

Kowloon is very much in the early stages of development and not ready for primetime, but I welcome any help in architecting and developing it!