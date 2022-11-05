import { Schema, model, models } from "mongoose";

const commentSchema = new Schema({
    post: Schema.ObjectId,
    author: {type: Schema.ObjectId, required: true},
    body: String,
    deleted: { type: Boolean, default: false },
    
}, { timestamps: true });

const Comment = models.Comment || model('Comment', commentSchema);

export default Comment;
