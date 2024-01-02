import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw, convertFromHTML, CompositeDecorator,  } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import htmlToDraft  from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.css";
import { togglePostEditor } from "../../store/ui";
// Icons
import { GoFileMedia } from 'react-icons/go';
import { GrDocumentText } from 'react-icons/gr'
import { LuStickyNote } from 'react-icons/lu'
import {FaLink, FaLock, FaLockOpen} from 'react-icons/fa'
import Kowloon from "../../lib/Kowloon";
import { useNavigate } from "react-router-dom";
import {
    setContent, setCharacterCount, setWordCount, setLink, setFeaturedImage, setImages, setUploads, setLengthWarning, setIsPublic, setCircle, setTitle, setPostType
} from "../../store/editor";

export default function PostEditor(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    // const [postType, setPostType] = useState(useSelector(state => state.post.postType) || "Note");
    const postType = useSelector(state => state.post.postType) || "Note";
    const content = useSelector(state => state.post.content) || "";
    const contentBlocks = htmlToDraft(content);
    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks))
    )
    const contentLength = useSelector(state => state.post.contentLength) || 0;
    const characterCount = useSelector(state => state.post.characterCount) || 0;
    const wordCount = useSelector(state => state.post.wordCount) || 0;
    const title = useSelector(state => state.post.title) || "";
    const link = useSelector(state => state.post.link) || "";
    const featuredImage = useSelector(state => state.post.featuredImage) || "";
    const [images, setImages] = useState([]);
    const [uploads, setUploads] = useState([]);
    const lengthWarning = useSelector(state => state.post.lengthWarning) || false;
    const isPublic = useSelector(state => state.post.isPublic) || false;
    const circle = useSelector(state => state.post.circle) || "";
    const maxLength = useSelector(state => state.post.maxLength) || 500;
    const linkRef = useRef(null);
    const EditorRef = useRef(null);

    const typeIcons = {
        "Note": <LuStickyNote className="inline h-[1em]" />,
        "Link": <FaLink className="inline h-[1em]" />,
        "Media": <GoFileMedia className="inline" />,
        "Article": <GrDocumentText className="inline" />
    }
    useEffect(() => EditorRef?.current.focus(), [EditorRef, postType]);

    // These functions update both the component state and the store


    const selectAudience = (e) => {
        if(e.target.value == "Public")
            setPublic(true);
        else
            setPublic(false);
        setCircle(e.target.value);
    }

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        let wc = editorState
          .getCurrentContent()
          .getPlainText("")
          .trim()
          .split(/\s+/).length;
        wc =
          wc == editorState.getCurrentContent().getPlainText("").trim().length < 1
            ? 0
                : wc;
        dispatch(setWordCount(wc));
        dispatch(setLengthWarning(postType == "Note" &&
          editorState.getCurrentContent().getPlainText("").length >=
            maxLength - 20))

        dispatch(setCharacterCount(editorState
          .getCurrentContent()
          .getPlainText("").length));
        dispatch(setContent(stateToHTML(editorState.getCurrentContent())));
        // dispatch(setContentLength(editorState
        //   .getCurrentContent()
        //   .getPlainText("").length))
    }

    const getLinkPreview = async function (e) {
        let linkPreview = await Kowloon.getLinkPreview(e.target.value);
        dispatch(setTitle(linkPreview.title));
        setEditorState(EditorState.createWithContent(ContentState.createFromText(linkPreview.description)));
        dispatch(setFeaturedImage(linkPreview.images[0]));
    }

    const handleUploads = (e) => { 

        dispatch(setFeaturedImage(""))
        setUploads([...uploads, ...Array.from(e.target.files).slice(0,8)])
        let uploadedImages = (Array.from(uploads).filter(f => f.type.startsWith("image/") ));
        setImages(uploadedImages);
        if (images && images.length > 1) dispatch(setFeaturedImage(URL.createObjectURL(images[0])));

    }

    const createPost = async () => {
        let activity = {
            type: "Create",
            actor: user.actor.id,
            objectType: "Post",
            object: {
                type: postType,
                actor: user.actor.id,
                title: title ? title.trim() : undefined,
                link: link ? link.trim() : undefined,
                source: { content: content, mediaType: "text/html" },
                wordCount,
                characterCount,
                featuredImage: featuredImage ? { url: featuredImage } : undefined,
                isPublic,
                circle: circle || undefined
            }
        }
        let response = await Kowloon.createActivity(activity);
        if (response.activity) {
            dispatch(togglePostEditor());
            window.location.href = "/";
        }
    }


    return (<>
        <div id="post-editor" className={postType || ""}>

            <div className="header">
                <h1>{typeIcons[postType]} Add New {postType}</h1>
                    <ul className="select-type">
                        <li className={`${postType == "Note" && "selected"} tooltip tooltip-bottom` } onClick={() => dispatch(setPostType("Note"))} ><LuStickyNote /></li>
                        <li className={`${postType == "Article" && "selected"} tooltip tooltip-bottom` } onClick={() => dispatch(setPostType("Article"))} ><GrDocumentText /></li>
                    <li className={`${postType == "Media" && "selected"} tooltip tooltip-bottom`} onClick={() => dispatch(setPostType("Media"))} ><GoFileMedia /></li>
                        <li className={`${postType == "Link" && "selected"} tooltip tooltip-bottom` } onClick={() => dispatch(setPostType("Link"))} ><FaLink /></li>
                    </ul>
            </div>
            <div className='description'>
                {postType == "Note" ? "Notes are text posts, 500 characters or less." : postType == "Article" ? "Articles can be long and have a title." : postType == "Media" ? "Media can include audio, video and images, as well as a title and description." : "Links to other posts or pages can have links, titles and descriptions."}
            </div>
            {postType != "Note" && <input className="title" type="text" placeholder="Post Title" value={title} onChange={(e) => dispatch(setTitle(e.target.value))} />}
            {postType == "Link" && <input className="link rounded-l-none" ref={linkRef} type="text" placeholder="Post Link URL" value={link} onChange={(e) => dispatch(setLink(e.target.value))} onBlur={getLinkPreview} />}
            {postType == "Media" && <div><input className="hidden" type='file' id="uploads" multiple accept={postType == "Note" ? ".jpg,.jpeg,.gif,.png,.mp3,.mp4,.mpg,.mp4" : "*"} onChange={handleUploads} max={postType == "Media" ? 8 : 1} />
                <button title="Upload Media" className="upload-button" onClick={() => {
                    document.getElementById("uploads").click()
                }}><GoFileMedia />Upload Media</button></div>}

            {/* The main editor */}
            <div className="editor-wrapper"><Editor
                           editorRef={(ref) => (EditorRef.current = ref)}
                // toolbarHidden={postType != "Article"}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', , 'emoji'],
                    inline: { options: ['bold', 'italic', 'underline'] },
                    blockType: { inDropdown: true, options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'] },
                    textAlign: { inDropdown: true },
                    // list: {inDropdown: true},
                }}
            editorState={editorState}
            editorClassName={postType && "type-" + postType}
            onEditorStateChange={onEditorStateChange}
            />
            </div>
            {/* / main editor */}
            <div className="lengthInfo">
            {postType == "Note" && <div className={lengthWarning ? "text-red-500" : ""}>{characterCount} / {maxLength}</div>}
                {postType != "Note" && <div>WC: {wordCount}</div>}
            </div>
            <div className="images flex">
                {featuredImage && <div className="featured-image"><div className="indicator"><span className="indicator-item btn btn-circle btn-sm" onClick={() => dispatch(setFeaturedImage(''))}>X</span><img className="object-scale-down" src={featuredImage} /></div></div>}
            {images.length > 0 && images.map((i, idx) => <div className="uploaded-image" key={idx}><div className="indicator"><span className="indicator-item btn btn-circle btn-sm" onClick={() => {
                
            }}>X</span><img src={URL.createObjectURL(i)} /></div></div>)}
                </div>
            {postType != "Media" && <div><input className="hidden" type='file' id="uploads" multiple accept={postType == "Note" ? ".jpg,.jpeg,.gif,.png,.mp3,.mp4,.mpg,.mp4" : "*"} onChange={handleUploads} max={postType == "Media" ? 8 : 1} />
                <button title="Upload Media" className="upload-button" onClick={() => {
                    document.getElementById("uploads").click()
                }}><GoFileMedia />Upload Media</button></div>}

            <div className="buttons">
                <div className="flex w-full">
                    <div className="text-left flex-none">
                   <label className="label"><span className="label-text">Audience</span></label>     
                    <select className="select select-bordered">
                        <option value="Public">Public</option>
                        <option value={user.actor.following.id}>Following</option>
                        <option value={user.actor.followers.id}>Followers</option>
                        <optgroup label="Circles">
                        {user.actor.circles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </optgroup>
                        </select>
                        </div>
                    <div className="text-right flex-1">
                        <button className="btn btn-primary mt-[3em] mr-2" onClick={() => createPost()}>Post {postType}</button>
                        <button className="btn btn-secondary mt-[3em]" onClick={() => dispatch(togglePostEditor())}>Cancel</button>
                    </div>
                </div>
                
            </div>
        </div>
        {/* /post editor */}
            <div id="post-editor-overlay" onClick={() => dispatch(togglePostEditor())}>

    </div >
        </>
    )
}