import { useState } from "react";
import axios from "axios";

export default function CreatePost(props) {
    console.log(props)
    const [postBody, setPostBody] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [postType, setPostType] = useState("status");
    const [postLink, setPostLink] = useState("");
    const [postPublic, setPostPublic] = useState(false);
    const [postCircles, setPostCircles] = useState([]);
    const circles = props.circles || [];
    const user = props.user || {};
    const token = props.user.loginToken || "";

    const [postBodyPlaceholder, setPostBodyPlaceholder] = useState({
        status: "Add your status here",
        post: "Add your post here",
        media: "Add your media description here",
        link: "Add your link description here"
    });

    const submitPost = async (e) => {
        e.preventDefault();
        // Put the code to add the post here
        let post = {
            author: user._id,
            content: postBody,
            type: postType,
            title: postTitle,
            link: postLink,
            public: postPublic,
            circles: postCircles.length > 0 ? postCircles : null

        }

        console.log(post)

        let response = await axios.post("/api/my/posts", { post }, {
            headers: {
                'Authorization': `Basic ${token}`
            }
        });
        console.log("response", response.data);

        return false;
    }

    const updateBody = (e) => {
        const bodyText = e.target.value;
        setPostBody(bodyText);
        switch (true) {
            case (bodyText.length >= 10):
                setPostType("post");
                break;
            case (bodyText.length == 0):
                setPostType("status");
                break;
    }
    }

    const updateCircle = (e) => {
        let newPostCircles = postCircles;
        if (e.currentTarget.value != "") {
            newPostCircles.push(e.currentTarget.value)
        } else {
            newPostCircles = [];
        }
        setPostCircles(newPostCircles)
    }
    const updatePrivacy = (e) => {
        
        setPostPublic(e.currentTarget.value === "public" ? true: false)
    }

    return (
        <form id="createPost">
            <div className="grid grid-cols-2">
            <fieldset className="col-span-2 mb-4 text-right">
                    Create New &nbsp; <select id="type" name="type" className={`post-type select select-bordered`} onChange={(e) => setPostType(e.target.value)} value={postType}>
                        <option value='status'>Status</option>
                        <option value='post'>Post</option>
                        <option value='media'>Media</option>
                        <option value='link'>Link</option>

                    </select>
                </fieldset>
                <fieldset className="col-span-2 mb-4">
                    <input type="text" id="title" name="title" className={`w-full input input-bordered text-lg font-bold post-title ${postType != "status" ? "visible" : "hidden"}`} placeholder="Title (optional)" />
                </fieldset>


                <fieldset className="col-span-2 mb-4">
                    <input type="text" id="link" name="link" className={`w-full input input-bordered text-sm post-link ${postType == "link" ? "visible" : "hidden"}`} placeholder="Link URL" />
                </fieldset>
                <fieldset className={`col-span-2 mb-4 text-right text-xs font-bold ${props.user.prefs.useMarkdown == true ? "visible" : "hidden"}`}>
                    You can use Markdown in this post.
                </fieldset>
                <fieldset className="col-span-2 mb-4">
                    <textarea id='body' name='body' className={`textarea textarea-bordered w-full ${postType == "post" ? "h-[24rem]" : "h-[6rem]"} {postType == "status" ? "text-xl" : ""}`} onChange={updateBody} placeholder={postBodyPlaceholder[postType]}></textarea>
                </fieldset>
                <fieldset className="col-span-1"></fieldset>
                <fieldset className="col-span-1 mb-4 text-right">
                    Privacy
                    <div className="form-control">
                        <label className="label cursor-pointer">
                        <span className="label-text  text-right">Public</span> 
                            <input type="radio" name="privacy" value="public" className="radio" checked={postPublic === true} onChange={updatePrivacy} />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer">
                        <span className="label-text">For Connections Only</span> 
                        <input type="radio" name="privacy" value="connections" className="radio" checked={postPublic === false && postCircles.length == 0} onChange={updatePrivacy}/>
                        </label>
                    </div>
                        
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">For <select id="target" name="target" className={`post-type select select-bordered`} onChange={updateCircle}>
                                <option value="">Select a circle</option>
                        <optgroup label="Circles">
                        {circles.map((circle,i) => {
                            return (<option key={i} value={circle._id}>{circle.name}</option>)
                        })}
                        </optgroup>
                    </select></span> 
                        <input type="radio" name="privacy" value="circles" className="radio " checked={postPublic === false && postCircles.length > 0} onChange={updatePrivacy}/>
                        </label>
                    </div>
                    {/* Privacy &nbsp; <select id="target" name="target" className={`post-type select select-bordered`} onChange={updateTarget}>
                        <option value='p'>Public</option>
                        <option value='c'>Connections Only</option>
                        <optgroup label="Circles">
                        {circles.map((circle) => {
                            return (<option value={circle._id}>{circle.name}</option>)
                        })}
                        </optgroup>
                    </select> */}
                </fieldset>
            <div className="col-span-2 text-right">
                    <button id="submitPost" name="submitPost" className="btn" onClick={submitPost}>Add &nbsp;<span className="uppercase">{postType}</span></button>
                </div>
                </div>
        </form>
    )
}