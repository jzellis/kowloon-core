import { get } from "mongoose";
import { Post } from "../../../models"

const getPost = async (id) => await Post.findOne(id);
const getPosts = async () => await Post.find();

export { getPost, getPosts };