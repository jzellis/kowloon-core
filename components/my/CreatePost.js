import { useState } from "react";
import { axios } from "axios";

export default function CreatePost(props) {

    const [postBody, setPostBody] = useState("");
    const [postType, setPostType] = useState("type");

    const submitPost = (e) => {
        e.preventDefault();
        // Put the code to add the post here
        let post = {
            body: postBody,
            type: postType
        }

        return false;
    }
    return (
        <form id="createPost">
            <textarea id='body' name='body' className="textarea textarea-bordered w-full h-[16rem]" onChange={(e) => setPostBody(e.target.value)}></textarea>
            <div className="text-right">
                <button id="submitPost" name="submitPost" className="btn btn-lg" onClick={submitPost}>Post</button>
            </div>
        </form>
    )
}