import connectMongo from "../../utils/connectMongo";
import {User, Comment} from "../../models";

const comment = async function (search = {
    _id: null
}) {
    let comment = await Comment.findOne(search);
    let user = await User.findOne({_id: comment.author})
    return JSON.parse(JSON.stringify({comment,user}));
}

const comments = async function (search = {}, limit = 0, offset = 0) {
    return JSON.parse(JSON.stringify(await Comment.find(search).limit(limit).skip(offset).exec()));
}

const addComment = async (comment) => {
    let response = {};
    try {
        let comment = await Comment.create(comment);
        response = {
            comment,
            comment
        };
    } catch (e) {
        response.error = e;
    }
    return JSON.parse(JSON.stringify(response));
}

const updateComment = async (commentId, fields) => {
    let response = {};
    try {
        let comment = await Comment.findByIdAndUpdate(commentId, fields);
        response = {
            comment
        };
    } catch (e) {
        response.error = e;
    }
    return JSON.parse(JSON.stringify(response));
}

export {
    comment,
    comments,
    addComment,
    updateComment
};