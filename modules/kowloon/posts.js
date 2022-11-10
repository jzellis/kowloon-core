import connectMongo from "../../utils/connectMongo";
import {User, Post} from "../../models";

const post = async function (search = {
    _id: null
}) {
    let post = await Post.findOne(search);
    let user = await User.findOne({_id: post.author})
    return JSON.parse(JSON.stringify({post,user}));
}

const posts = async function (search = {}, limit = 0, offset = 0) {
    return JSON.parse(JSON.stringify(await Post.find(search).limit(limit).skip(offset).exec()));
}

const addPost = async (post) => {
    let response = {};
    try {
        let post = await Post.create(post);
        let circle = await Circle.create({
            name: "Friends",
            post: post._id
        })
        response = {
            post,
            circle
        };
    } catch (e) {
        response.error = e;
    }
    return JSON.parse(JSON.stringify(response));
}

const updatePost = async (postId, fields) => {
    let response = {};
    try {
        let post = await Post.findByIdAndUpdate(postId, fields);
        response = {
            post
        };
    } catch (e) {
        response.error = e;
    }
    return JSON.parse(JSON.stringify(response));
}

export {
    post,
    posts,
    addPost,
    updatePost
};