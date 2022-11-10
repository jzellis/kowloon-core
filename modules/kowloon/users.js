import connectMongo from "../../utils/connectMongo";
import {User, Circle} from "../../models";

const user = async function (search = {
    _id: null
}) {

    return JSON.parse(JSON.stringify(await User.findOne(search)));
}

const users = async function (search = {}, limit = 0, offset = 0) {
    return JSON.parse(JSON.stringify(await User.find(search).limit(limit).skip(offset).exec()));
}

const addUser = async (user) => {
    let response = {};
    try {
        let user = await User.create(user);
        let circle = await Circle.create({
            name: "Friends",
            user: user._id
        })
        response = {
            user,
            circle
        };
    } catch (e) {
        response.error = e;
    }
    return JSON.parse(JSON.stringify(response));
}

const updateUser = async (userId, fields) => {
    let response = {};
    try {
        let user = await User.findByIdAndUpdate(userId, fields);
        response = {
            user
        };
    } catch (e) {
        response.error = e;
    }
    return JSON.parse(JSON.stringify(response));
}

export {
    user,
    users,
    addUser,
    updateUser
};