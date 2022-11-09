import { Schema, model, models } from "mongoose";

const postSchema = new Schema({
    author: {type: Schema.ObjectId, required: true},
    postType: {
        type: String, enum: ["status", "post", "media", "link"], default: "status", required: true
            },
    title: String,
    slug: String,
    content: { 
        description: String,
        html: String,
        text: String
     },
    media: [Schema.ObjectId],
    link: String,
    circles: [{type: Schema.ObjectId}],
    published: { type: Boolean, default: true },
    public: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    
}, { timestamps: true });

const Post = models.Post || model('Post', postSchema); 

export default Post;
