window.global ||= window;

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch } from "react-redux";
import { togglePostEditor } from "../../store/ui";
import { setPosts } from "../../store/posts";
import Kowloon from "../../lib/Kowloon";
import { GoFileMedia } from 'react-icons/go';
import { GrDocumentText } from 'react-icons/gr'
import { LuStickyNote } from 'react-icons/lu'
import {FaLink, FaLock, FaLockOpen} from 'react-icons/fa'
import { Transition } from "@headlessui/react"
import "./index.css";

const PostEditor = (props) => {
    const postEditorOpen = useSelector(state => state.ui.postEditorOpen);
    const user = useSelector(state => state.ui.user);
    const newPostType = useSelector(state => state.ui.newPostType);
    const actor = user.actor
    const [postType, setPostType] = useState(newPostType || "Note");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [content, setContent] = useState("");
    const [contentLength, setContentLength] = useState(0);
    const [isPublic, setPublic] = useState(true);
    const [circles, setCircles] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [gettingLinkPreview, setGettingLinkPreview] = useState(false);
    const [lengthWarning, setLengthWarning] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [modalPostEditor, setModalPostEditor] = useState(false);
    const maxLength = 500;
    const dispatch = useDispatch();
    const EditorRef = useRef(null);


    const onEditorStateChange = (editorState) => {
        setLengthWarning((postType == "Note" && editorState.getCurrentContent().getPlainText("").length >= maxLength - 20))
        if(postType != "Note" || (postType == "Note" && editorState.getCurrentContent().getPlainText("").length < maxLength))
        setEditorState(editorState);

        setContent(stateToHTML(editorState.getCurrentContent()));
        setContentLength(editorState.getCurrentContent().getPlainText("").length)
    };



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

    const changePostType = (type) =>{
        setPostType(type);
        setModalPostEditor(type == "Article" ? true : false)
        return true;
    }

    const handleUploads = (e) => { 

        setFeaturedImage("")
        setUploads([...uploads, ...Array.from(e.target.files).slice(0,8)])
        let images = Array.from(uploads).filter(f => f.type.startsWith("image/"));
        // let images = e.target.files.filter(f => f.type.startsWith("image/"));
        if(uploads && uploads.length == 1) setFeaturedImage(URL.createObjectURL(images[0]));
    }

    
    const removeUpload = (index) => { 

        let newUploads = [...uploads];
        newUploads.splice(index, 1);
        setUploads(newUploads);
        // if(newUploads.length === 1) setFeaturedImage(URL.createObjectURL(newUploads[0]));

    }

    const setAudience = (e) => {
        if (e.target.value === "public") {
            setPublic(true);
            setCircles([])
        } else {
            setPublic(false);
            setCircles(Array.from(new Set([...circles, e.target.value])));
        }
    }

    const resetEditor = () => {
        setEditorState(EditorState.createEmpty());
        setContentLength(0);
        setTitle("");
        setLink("");
        setFeaturedImage("");
        setUploads([]);
    }

    const addPost = async (e) => {
        e.preventDefault();
        setIsPosting(true);
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
           attachment: attachments.length > 0 ? attachments : null,
            public: isPublic
       }
        await Kowloon.addPost(post);
        resetEditor();
        let data = await Kowloon.getPublicTimeline();
        dispatch(setPosts(data.items))
        dispatch(togglePostEditor())
        setIsPosting(false);

    }

    useEffect(() => EditorRef?.current.focus(), [EditorRef, postType]);
    return (
        <>
            <div className={`post-editor-container mt-2 type-${postType.toLowerCase()}`}>
                <div className="post-editor-bg w-full h-full">
                <div className="post-type-buttons">

                <div className="join">
                <div className="tooltip tooltip-bottom" data-tip="Note">
                <button className={`${postType && postType == "Note" ? "active" : "inactive"}`} onClick={() => changePostType("Note")} value="Note"><LuStickyNote className="h-[1.5em] w-auto" /></button>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Article">
                    <button className={`${postType && postType == "Article" ? "active" : "inactive"}`} onClick={() => changePostType("Article")} value="Article"><GrDocumentText className="h-[1.5em] w-auto" /></button>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Media">

                    <button className={`${postType && postType == "Media" ? "active" : "inactive"}`} onClick={() => changePostType("Media")} value="Media"><GoFileMedia className="h-[1.5em] w-auto" /></button>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Link">

                    <button className={`${postType && postType == "Link" ? "active" : "inactive"}`} onClick={() => changePostType("Link")} value="Link"><FaLink className="h-[1.5em] w-auto" /></button>
                    </div>
                    </div>
                    </div>
            <div className={`post-editor`}>
            <span className="text-sm font-bold uppercase mb-2">New {postType}</span>
            <div className="overflow-hidden">
            <Transition
        show={postType != "Note"}
        enter="transition-all transform ease-out duration-100"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition transform ease duration-50"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-full"
      >
               <div className="w-full mb-4"><input className="input w-full" placeholder="Post Title (optional)" defaultValue={title} onChange={e => setTitle(e.target.value)} /></div>
                </Transition>
            </div>
            <div className="overflow-hidden">
            <Transition
        show={postType == "Link"}
        enter="transition-all transform ease-out duration-100"
        enterFrom="-translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition transform ease duration-50"
        leaveFrom="translate-y-0"
        leaveTo="-translate-y-full"
      >
        <div className="w-full mb-4"><input className="input w-full" placeholder="Link URL" onChange={e => setLink(e.target.value)} onBlur={getLinkPreview} /></div>
                
                </Transition>
                </div>
           
        {postType == "Link" && gettingLinkPreview && <div className="w-full mb-4 text-sm italic text-center"><span className="loading loading-xs"></span>Getting Link Preview...</div>}

                        <Editor
                           editorRef={(ref) => (EditorRef.current = ref)}
            toolbarHidden={postType != "Article"}
            editorState={editorState}
            editorClassName={postType && "type-" + postType.toLowerCase()}
            onEditorStateChange={onEditorStateChange}
        />
        <div className={`${postType != "Note" ? "hidden" : ""} text-right text-xs md:text-sm 
        ${lengthWarning && contentLength < maxLength ? "text-yellow-500" : "text-gray-500"} ${contentLength == maxLength && "text-red-500 font-bold"}
        `}>{contentLength}/{maxLength}</div>

                    {featuredImage && <div className="mt-8 w-full h-auto text-center items-center" onClick={() => setFeaturedImage("")}><div className="relative w-auto h-auto text-center"><img className="rounded-lg border border-gray-200 h-48 w-auto mx-auto" src={featuredImage} /><div className="absolute bg-white bg-opacity-50 align-middle top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center opacity-0 hover:opacity-100 flex items-center"><div className="w-full text-center">Remove</div></div></div></div>}

        {(uploads.length > 0 && !featuredImage) &&
            <div className="upload-items">
                    {uploads.map((f, i) => {
                        console.log(f); return (
                            <>
                                <div className="indicator w-full h-full cursor-pointer"><span className="indicator-item badge indicator-top indicator-end" onClick={() => removeUpload(i)}>x</span>

                                <div key={`uploads-${i}`} className="card w-full aspect-square" >

                                <figure>{f.type.includes("image") && <img className="w-full h-auto overflow-clip" key={`uploads-${i}`} src={URL.createObjectURL(f)} />}
                            {f.type.includes("audio") && <><audio><source src={URL.createObjectURL(f)} type={f.type} /></audio></>}
                            {f.type.includes("video") && <><video className="rounded-lg mx-auto my-auto align-middle h-full"><source src={URL.createObjectURL(f)} type={f.type} /></video></>}
                                        </figure>
                                        <div className="card-body p-0 text-xs text-gray-400 truncate w-full">
                                            {f.name}
                                            </div>
                                    </div>
                                    </div>
                            </>
                        )
                    })}
                            </div >
                }
                <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="w-full">
                        {postType != "Link" &&
                        <>
                        <input className="hidden" type='file' id="uploads" multiple accept={postType == "Note" ? ".jpg,.jpeg,.gif,.png,.mp3,.mp4,.mpg,.mp4" : "*"} onChange={handleUploads} max={postType == "Media" ? 8 : 1} />
                            <button title="Upload Media" className="btn btn-outline" onClick={() => {
    document.getElementById("uploads").click();
}}><GoFileMedia /><span className="!text-xs lg:!text-sm">Upload Media</span></button>
</>
                        }
                        </div>
                        <div className="w-full text-right">
                            <div className="join">
                                <div className="h-full rounded-none p-4">{isPublic && <FaLockOpen className="text-gray-500" />}{!isPublic && <FaLock />}</div>
                                <select name="audience" className="select" defaultValue="public" onChange={setAudience}>
                                <option value="public">Public</option>
                                {user && user.actor && user.actor.circles.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>

                            </div>
                            </div>
                        </div>

                
                        <div className="mt-4 w-full text-right"><button disabled={isPosting} className="btn btn-ghost hover:btn-primary" onClick={addPost}>{`${isPosting ? "Posting..." : "Add " + postType}`}</button><button onClick={() => {dispatch(togglePostEditor()); resetEditor();}} className="btn btn-ghost ml-2">Cancel</button></div>
        
            </div>
                </div>
                </div>
            </>
    )
}

export default PostEditor;