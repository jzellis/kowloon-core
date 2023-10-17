window.global ||= window;

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import store from "../../../store";
import Kowloon from "../../lib/Kowloon";
const PostEditor = (props) => {
    const actor = useSelector(state => state.ui.user);
    const [postType, setPostType] = useState("Note");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [content, setContent] = useState("");
    const [contentLength, setContentLength] = useState(0);
    const [isPublic, setPublic] = useState(true);
    const [uploads, setUploads] = useState([]);
    const maxLength = 20;


    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        setContent(stateToHTML(editorState.getCurrentContent()));
        setContentLength(editorState.getCurrentContent().getPlainText("").length)
    };

    const handleUploads = (e) => { 

        setUploads(e.target.files)
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
           attachments: attachments.length > 0 ? attachments : null,
            public: isPublic
       }
        console.log(await Kowloon.addPost(post));

    }


    return (<div className="post-editor">
        <div className="flex mb-4">
            <div className="flex-1">Create New</div>
            <div className="flex-none">
            <select className="select" defaultValue={postType} onChange={(e) => {setPostType(e.target.value)}}>
                <option value="Note">Note</option>
                <option value="Article">Article</option>
                <option value="Media">Media</option>
                <option value="Link">Link</option>
                </select>
                </div>
        </div>
        {postType != "Note" && <div className="w-full mb-4"><input className="input w-full" placeholder="Title" onChange={e => setTitle(e.target.value)} /></div>}
        {postType == "Link" && <div className="w-full mb-4"><input className="input w-full" placeholder="Link URL" onChange={e => setLink(e.target.value)} /></div>}

        <Editor
            toolbarHidden={postType != "Article"}
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
        />
        <div className={`${postType != "Note" ? "hidden" : ""} text-right text-sm text-gray-500`}>{contentLength}/{maxLength}</div>
        <div className="w-full text-center"><input className="hidden" type='file' id="uploads" multiple={postType === "Media"} accept={postType == "Note" ? ".jpg,.jpeg,.gif,.png,.mp3,.mp4,.mpg,.mp4" : "*"} onChange={handleUploads} /> <span className="btn btn-secondary" onClick={() => {
            document.getElementById("uploads").click();
         }}>File</span></div>

        <div className="flex">
            <div className="flex-1">This {postType} is</div>
            <div className="flex-none flex">
                <label className="label flex-1"><input className="radio mr-1" type="radio" name="isPublic" onClick={() => setPublic(true)} defaultChecked={isPublic} /> Public</label>
                <label className="label"><input className="radio mr-1" type="radio" name="isPublic" onClick={() => setPublic(false)} defaultChecked={!isPublic}/> Private</label>
            </div>
        </div>

        <div className="w-full text-right"><span className="btn btn-primary hover:btn-success" onClick={addPost}>Add {postType}</span></div>
        
    </div>)
}

export default PostEditor;