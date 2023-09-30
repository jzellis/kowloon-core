/* eslint-disable no-unused-vars */
import { useState } from "react";
import {GoNote} from "react-icons/go"
import { BsGear } from "react-icons/bs"
import { RiArticleLine } from "react-icons/ri"
import { MdPermMedia } from "react-icons/md"
import { BiLink } from "react-icons/bi"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const PostEditor = (props) => {

    const [postType, setPostType] = useState("Article");
    const postTypes = {
        Note: { icon: GoNote, value: "Note" },
    Article: { icon: RiArticleLine, value: "Article" },
    Media: { icon: MdPermMedia, value: "Media" },
    Link: { icon: BiLink, value: "Link" },

    };
    const [postContent, setPostContent] = useState('');
    const [postTypeMenuOpen, setPostTypeMenuOpen] = useState(false);
    let selectedType = postTypes[postType]
    const [isPublic, setIsPublic] = useState(true);


    const modules = {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
      };
    return (


        <section className='post-editor'>
        <div className='editor-header flex'>
                <label className='flex-1'>Add New
                
                    
                    <select className='select w-full mb-4' onChange={e => setPostType(e.target.value)} defaultValue={postType}>
                        {Object.keys(postTypes).map((key, i) => { let type = postTypes[key]; return (<option key={i} value={type.value}>{type.value}</option>) })}
                    </select>
          </label>
          <div className='flex-none cursor-pointer'><BsGear className='text-xl mt-2 hover:font-bold' /></div>
            </div>
            <div className={`${postType == "Link" ? "visible" : "hidden"} mb-4`}><input className="input input-bordered w-full" placeholder="Link" /></div>
            <div id="postTitle" className={`${postType != "Note" ? "visible" : "hidden"} mb-4`}><input className="input input-bordered w-full" placeholder="Title" /></div>
            <ReactQuill theme="snow" value={postContent} onChange={setPostContent}  />
        <div className='post-settings flex'>
          <label className='flex-1'>This post is: </label>
          <ul className='flex-none'>
            <li><label className='label'><input className='radio mr-4' type='radio' checked={isPublic} name='public' onChange={e => setIsPublic(true)} /> Public</label></li>
                    <li><label className='label'><input className='radio mr-4' type='radio' checked={!isPublic} name='public' onChange={e => setIsPublic(false)}/> For <select className='ml-4 w-24 select' onClick={e => setIsPublic(false)}>
                <option>Friends</option>
                <option>Family</option>
                <option>Co-Workers</option>
                <optgroup>
                  <option>Add New Circle</option>
                </optgroup>
              </select>
            </label></li>

          </ul>
        </div>
        <div className='w-full text-right'>
          <button className='btn btn-primary'>Add Post</button>
          </div>
      </section>



    )
 }
 
export default PostEditor;