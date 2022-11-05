import { Schema, model, models } from "mongoose";

const kowloonSchema = new Schema({
    name: String,
    value: Schema.Types.Mixed
    
}, { timestamps: true });

const Kowloon = models.Kowloon || model('Kowloon', kowloonSchema); 

export default Kowloon;
