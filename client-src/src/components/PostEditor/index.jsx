window.global ||= window;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch } from "react-redux";
import { setPosts } from "../../../store/posts";
import Kowloon from "../../lib/Kowloon";
import {GoFileMedia} from 'react-icons/go';
import { set } from "lodash";

const PostEditor = (props) => {
    const user = useSelector(state => state.ui.user);
    const actor = user.actor
    const [postType, setPostType] = useState("Note");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [content, setContent] = useState("");
    const [contentLength, setContentLength] = useState(0);
    const [isPublic, setPublic] = useState(true);
    const [uploads, setUploads] = useState([]);
    const [gettingLinkPreview, setGettingLinkPreview] = useState(false);
    const maxLength = 20;
    const dispatch = useDispatch();


    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        setContent(stateToHTML(editorState.getCurrentContent()));
        setContentLength(editorState.getCurrentContent().getPlainText("").length)
    };

    const changePostType = (e) => { 
        console.log(postType, e.target.value)
        if (postType != "Note" && e.target.value == "Note") {
            if (confirm("Are you sure you want to change the post type? You will lose any content you have entered.")) {
                setPostType(e.target.value);
                setTitle("");
                setLink("");
            }
        } else {
            setPostType(e.target.value);
        }
    }

    const getLinkPreview = async () => { 

        if (link.length > 0) {
            try {
                let isLink = Boolean(new URL(link));
                setGettingLinkPreview(true);
                let preview = await Kowloon.getLinkPreview(link);
                console.log(preview)
                if (preview.title) setTitle(`${preview.siteName ? preview.siteName + " | " : ""}${preview.title}`);
                if (preview.images && preview.images.length > 0) setFeaturedImage(preview.images[0]);
                if (preview.description) setEditorState(EditorState.createWithContent(ContentState.createFromText(preview.description)));
                setGettingLinkPreview(false);
            } catch (e) {
                
            }
        }

    }

    const handleUploads = (e) => { 

        setFeaturedImage("")
        setUploads(Array.from(e.target.files))
        let images = Array.from(uploads).filter(f => f.type.startsWith("image/"));
        // let images = e.target.files.filter(f => f.type.startsWith("image/"));
        if(uploads.length == 1) setFeaturedImage(URL.createObjectURL(images[0]));
    }

    
    const removeUpload = (index) => { 

        let newUploads = [...uploads];
        newUploads.splice(index, 1);
        setUploads(newUploads);
        // if(newUploads.length === 1) setFeaturedImage(URL.createObjectURL(newUploads[0]));

    }

    const addPost = async () => { 
        let attachments = [];
        if (uploads.length > 0) { 

            attachments = await Kowloon.upload(uploads);

        }




       const post = {
           actor: actor.id,
           attributedTo: actor.id,
            type: postType,
            title: title.length > 0 ? title : undefined,
           href: link.length > 0 ? link : undefined,
            to: [actor.id],
            source: {
                content: content,
                mediaType: "text/html"
           },
            featuredImage: featuredImage.length > 0 ? featuredImage : undefined,
           attachments: attachments.length > 0 ? attachments : null,
            public: isPublic
       }
        await Kowloon.addPost(post);
        setEditorState(EditorState.createEmpty());
        setContentLength(0);
        setTitle("");
        setLink("");
        setFeaturedImage("");
        setUploads([]);
        let data = await Kowloon.getPublicTimeline();
        dispatch(setPosts(data.items))

    }


    return (<div className="post-editor">
        <div className="flex mb-4">
            <div className="flex-1">Create New</div>
            <div className="flex-none">
            <select className="select" defaultValue={postType} onChange={changePostType}>
                <option value="Note">Note</option>
                <option value="Article">Article</option>
                <option value="Media">Media</option>
                <option value="Link">Link</option>
                </select>
                </div>
        </div>
        {postType != "Note" && <div className="w-full mb-4"><input className="input w-full" placeholder="Post Title" defaultValue={title} onChange={e => setTitle(e.target.value)} /></div>}
        {postType == "Link" && <><div className="w-full mb-4"><input className="input w-full" placeholder="Link URL" onChange={e => setLink(e.target.value)} onBlur={getLinkPreview} /></div>
        </>}
        {postType == "Link" && gettingLinkPreview && <div className="w-full mb-4 text-sm italic text-center"><span className="loading loading-xs"></span>Getting Link Preview...</div>}

        <Editor
            toolbarHidden={postType != "Article"}
            editorState={editorState}
            editorClassName={postType.toLowerCase()}
            onEditorStateChange={onEditorStateChange}
        />
        <div className={`${postType != "Note" ? "hidden" : ""} text-right text-sm text-gray-500`}>{contentLength}/{maxLength}</div>
        {featuredImage && <div className="mt-8 w-full h-auto text-center items-center" onClick={() => setFeaturedImage("")}><div className="relative w-auto h-auto text-center"><img className="rounded-lg border border-gray-200 h-48 w-auto mx-auto" src={featuredImage} /><div className="absolute bg-white bg-opacity-50 align-middle top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center opacity-0 hover:opacity-100 flex items-center"><div className="w-full text-center">Remove</div></div></div></div>}
        {(uploads.length > 0 && !featuredImage) &&
            <div className="mt-8 w-full h-auto grid grid-cols-4 gap-2 items-center">
                {uploads.map((f, i) => { return (<div key={`uploads-${i}`} className="aspect-square  bg-slate-300 rounded-lg items-center cursor-pointer" onClick={() => removeUpload(i)}><div className="relative h-full w-full"><img className="p-4 mx-auto my-auto align-middle h-full" key={`uploads-${i}`} src={URL.createObjectURL(f)} /><div className="absolute bg-white bg-opacity-50 align-middle top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center opacity-0 hover:opacity-100 flex items-center"><div className="w-full text-center">Remove</div></div></div></div>) })}
                </div>}
        <div className="w-full"><input className="hidden" type='file' id="uploads" multiple accept={postType == "Note" ? ".jpg,.jpeg,.gif,.png,.mp3,.mp4,.mpg,.mp4" : "*"} onChange={handleUploads} /> <span className="btn btn-ghost btn-sm" onClick={() => {
            document.getElementById("uploads").click();
        }}><GoFileMedia /> {postType == "Media" ? "Upload Media" : "Upload Images"}</span></div>

        <div className="w-full flex">
            <div className="flex-1">This {postType} is</div>
            <div className="flex-none flex">
                <label className="label flex-1"><input className="radio mr-1" type="radio" name="isPublic" onClick={() => setPublic(true)} defaultChecked={isPublic} /> Public</label>
                    <label className="label flex-none"><input className="radio mr-1" type="radio" name="isPublic" onClick={() => setPublic(false)} defaultChecked={!isPublic} /> Private</label>


            </div>


        </div>
        {isPublic === false && <div className="w-full text-right">Circles: <select className="select">{user.actor.circles && user.actor.circles.map(c => {
                    return <option key={c.id} value={c.name}>{c.name}</option>
                })}</select></div>
                }
        <div className="mt-4 w-full text-right"><span className="btn btn-primary hover:btn-success" onClick={addPost}>Add {postType}</span></div>
        
    </div>)
}

export default PostEditor;