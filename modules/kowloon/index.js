import connectMongo from "../../utils/connectMongo";
import {
    User,
    Post,
    Homie,
    Circle,
    Comment,
    Media,
    CircleHomie,
    Settings
} from "../../models";
import {
    user,
    users,
    addUser,
    updateUser
} from "./users";
import {
    post,
    posts,
    addPost,
    updatePost
} from "./posts"
import { circle, circles, addCircle, updateCircle } from "./circles";
import { comment, comments, addComment, updateComment } from "./circles";

// export const Kowloon = async (options) => {

//     const db = await connectMongo();

//     const settingsCall = await Settings.findOne();
//     const settings = settingsCall;

//     const getUser = async (fieldname = "_id",value = null) => await User.findOne({ fieldname: value });
//     const getPost = async (fieldname = "_id",value = null) => await Post.findOne({ fieldname: value });
//     const getHomie = async (fieldname = "_id",value = null) => await Homie.findOne({ fieldname: value });
//     const getCircle = async (fieldname = "_id", value = null) => await Circle.findOne({ fieldname: value });
//     const getComment = async (fieldname = "_id",value = null) => await Comment.findOne({ fieldname: value });
//     const getMedia = async (fieldname = "_id",value = null) => await Media.findOne({ fieldname: value });
//     const getCircleHomie = async (fieldname = "_id",value = null) => await CircleHomie.findOne({ fieldname: value });


//         return {
//             settings,
//             getUser,
//             getPost,
//         };




// }
/** Kowloon object */
class Kowloon {
    constructor() {

    }


    /** Static method, returns server settings */
    static async settings() {
        return JSON.parse(JSON.stringify(await Settings.findOne({}, {
            _id: 0
        })));
    }
    /** Static method, returns a single user based on critera passed (i.e. {username: bob"}) */
    static async user(search = {
        _id: null
    }) {
        return user(search);
    }

    /** Static method, returns an array of users based on critera passed (i.e. {username: bob"}) with limit and offset */
    static async users(search = {}, limit = 0, offset = 0) {
        return users(search, limit, offset);
    }

    /** Static method, returns a single user based on critera passed (i.e. {username: bob"}) */
    static async post(search = {
        _id: null
    }) {
        return post(search);
    }

    /** Static method, returns an array of users based on critera passed (i.e. {username: bob"}) with limit and offset */
    static async posts(search = {}, limit = 0, offset = 0) {
        return posts(search, limit, offset);
    }

    /** Static method, returns a single user based on critera passed (i.e. {username: bob"}) */
    static async circle(search = {
        _id: null
    }) {
        return circle(search);
    }

    /** Static method, returns an array of users based on critera passed (i.e. {username: bob"}) with limit and offset */
    static async circles(search = {}, limit = 0, offset = 0) {
        return circles(search, limit, offset);
    }

    static async comment(search = {
        _id: null
    }) {
        return comment(search);
    }

    /** Static method, returns an array of users based on critera passed (i.e. {username: bob"}) with limit and offset */
    static async comments(search = {}, limit = 0, offset = 0) {
        return comments(search, limit, offset);
    }
    
}


export default Kowloon;