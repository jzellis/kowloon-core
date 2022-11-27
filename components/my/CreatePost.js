import { useState, useEffect } from "react";
import { Image } from "next/image";
import axios from "axios";
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertFromHTML,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
// import { stateFromHTML } from "draft-js-import-html";
// import { stateToMarkdown } from "draft-js-export-markdown";
// import { stateFromMarkdown } from "draft-js-import-markdown";
import Select from "react-select";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import "draft-js/dist/Draft.css";
import reactSelect from "react-select";
const showdown = require("showdown"),
  converter = new showdown.Converter();

export default function CreatePost(props) {
  const [postTypes, setPostTypes] = useState([]);
  const [user, setUser] = useState(props.user);
  const [postTitle, setPostTitle] = useState("");
  const [postType, setPostType] = useState("status");
  const [postLink, setPostLink] = useState("");
  const [postPublic, setPostPublic] = useState(false);
  const [postCircles, setPostCircles] = useState([]);
  //  These are the raw uploaded files
  const [postFiles, setPostFiles] = useState([]);
  // These are the Media objects created by uploads of files, not the files themselves
  const [postMedia, setPostMedia] = useState([]);
  const [postImages, setPostImages] = useState([]);
  const [postAudios, setPostAudios] = useState([]);
  const [postVideos, setPostVideos] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editor, setEditor] = useState(false);
  const [italic, setItalic] = useState(false);
  const [bold, setBold] = useState(false);
  const [underline, setUnderline] = useState(false);

  const circles = props.circles || [];
  const [showTypesTooltip, setTypeTooltip] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(0);

  const token = props.user.loginToken || "";

  const [postBodyPlaceholder, setPostBodyPlaceholder] = useState({
    status: "Add your status here",
    post: "Add your post here",
    media: "Add your media description here",
    link: "Add your link description here",
  });

  const inlineStyles = [
    {
      label: "Bold",
      class: "font-bold",
      style: "BOLD",
      icon: <FaBold />,
    },
    {
      label: "Italic",
      class: "italic",
      style: "ITALIC",
      icon: <FaItalic />,
    },
    {
      label: "Underline",
      class: "underline",
      style: "UNDERLINE",
      icon: <FaUnderline />,
    },
  ];

  useEffect(() => {
    // This is the only way to get the Draftjs editor to not fuck up with Next.
    setEditor(true);
    const asyncPostType = async () => {
      let postTypes = await getPostTypes();
      setPostTypes(postTypes);
    };
    asyncPostType();
    return;
  }, []);

  const getPostTypes = async () => {
    let response = await axios.get("/api/utils/postTypes");
    return response.data.types;
  };

  const submitPost = async (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    let currentContent =
      user.prefs.useMarkdown === true
        ? converter.makeHtml(plainText)
        : stateToHTML(contentState);

    let post = {
      author: user._id,
      content: {
        html: currentContent,
        text: plainText,
        description: plainText.substring(0, 500),
      },
      postType: postType,
      title: postTitle,
      link: postLink,
      public: postPublic,
      circles: postCircles.length > 0 ? postCircles : null,
    };

    if (postFiles.length > 0) {
      let formbody = new FormData();
      formbody.append("userId", post.author);

      postFiles.forEach((file, i) => {
        formbody.append("media", file, file.name);
      });
      console.log(formbody);
      let mResponse = await axios.post("/api/media", formbody, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (mResponse.data.media) {
        mResponse.data.media.forEach((media) => {
          let oldMedia = postMedia;
          oldMedia.push(media._id);
          setPostMedia(oldMedia);
        });
        console.log(postMedia);
      }
      // post.media.push(mResponse.data.media);

      // Handle media upload
    }

    // let response = await axios.post(
    //   "/api/posts",
    //   { post },
    //   {
    //     headers: {
    //       Authorization: `Basic ${token}`,
    //     },
    //   }
    // );
    // console.log("response", response.data);

    return false;
  };

  const handleKeyCommand = (command) => {
    // inline formatting key commands handles bold, italic, code, underline
    let theEditorState = RichUtils.handleKeyCommand(editorState, command);

    if (theEditorState) {
      setEditorState(theEditorState);
      return "handled";
    }

    return "not-handled";
  };

  const updateCircle = (e) => {
    let newPostCircles = postCircles;
    if (e.currentTarget.value != "") {
      newPostCircles.push(e.currentTarget.value);
    } else {
      newPostCircles = [];
    }
    setPostCircles(newPostCircles);
  };
  const updatePrivacy = (e) => {
    setPostPublic(e.currentTarget.value === "public" ? true : false);
  };

  const updateEditor = (state) => {
    // if (state.getCurrentContent().getPlainText().length > 500)
    //   setPostType("post");
    // if (state.getCurrentContent().getPlainText().length < 500)
    //   setPostType("status");
    setEditorState(state);

    // Here's where we need to figure out how to convert Markdown to formatted Draft.js state if the user prefers Markdown
  };

  const handleLinkPreview = async (e) => {
    const httpRegex =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    let link = e.target.value;
    console.log(httpRegex.test(link));

    if (httpRegex.test(link)) {
      setPostType("link");
      let response = await axios.get(`/api/utils/preview?url=${link}`);
      console.log(response.data);
      if (response.data.preview) {
        setPostTitle(response.data.preview.title);
        if (response.data.preview.images[0])
          setPostImage(response.data.preview.images[0]);
        const fdesc = convertFromHTML(`${response.data.preview.description}`);

        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              fdesc.contentBlocks,
              fdesc.entityMap
            )
          )
        );

        setPostLink(link);
      }
    }
  };

  const uploadMedia = (e) => {
    e.preventDefault();

    if (e.target.files) {
      setPostFiles([]);
      setPostImages([]);
      setPostAudios([]);
      setPostVideos([]);
      setFilesUploaded(0);
      for (let x = 0; x < e.target.files.length; x++) {
        const i = e.target.files[x];
        let oldFiles = postFiles;
        oldFiles.push(i);
        setPostFiles(oldFiles);
        switch (true) {
          case i.type.includes("image"):
            let oldImages = postImages;
            oldImages.push(i);
            setPostImages(oldImages);
            break;
          case i.type.includes("audio"):
            let oldAudios = postAudios;
            oldAudios.push(i);
            setPostAudios(oldAudios);
            break;
          case i.type.includes("video"):
            let oldVideos = postVideos;
            oldVideos.push(i);
            setPostVideos(oldVideos);
            break;
        }
        setFilesUploaded(filesUploaded + 1);
      }
    }
    return false;
  };

  const changePostType = (e) => {
    setPostType(e.target.value);

    if (e.target.value != "media") {
      setPostAudios([]);
      setPostVideos([]);
      setPostImages([]);
      setPostMedia([]);
    }

    if (e.target.value != "link") {
      setPostLink("");
    }
  };

  const applyStyle = (e, style) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const isStyleActive = (style) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style);
  };

  return (
    <form id="createPost">
      <div className="grid grid-cols-2">
        <fieldset className="col-span-2 flex items-center justify-end">
          <label for="type" className="w-auto mr-4">
            Create New
          </label>
          <select
            id="type"
            name="type"
            className={`post-type select text-md font-bold w-1/4`}
            onChange={changePostType}
            value={postType}
          >
            {postTypes.map((type, i) => {
              return (
                <option key={i} value={type.value} title={type.description}>
                  {type.name}
                </option>
              );
            })}
          </select>
        </fieldset>
        <fieldset className="col-span-2 mb-4">
          <input
            type="text"
            id="title"
            name="title"
            className={`w-full input input-bordered text-lg font-bold post-title ${
              postType != "status" ? "visible" : "hidden"
            }`}
            placeholder="Title (optional)"
            // defaultValue={postTitle}
            defaultValue={postTitle}
            onChange={(e) => {
              setPostTitle(e.value);
            }}
          />
        </fieldset>

        <fieldset className="col-span-2 mb-4">
          <input
            type="text"
            id="link"
            name="link"
            className={`w-full input input-bordered text-sm post-link ${
              postType == "link" ? "visible" : "hidden"
            }`}
            placeholder="Link URL"
            onBlur={handleLinkPreview}
          />
        </fieldset>
        <fieldset
          className={`col-span-2 mb-4 text-right text-xs font-bold ${
            props.user.prefs.useMarkdown == true ? "visible" : "hidden"
          }`}
        >
          You can use Markdown in this post.
        </fieldset>
        {/* <fieldset
          className={`${
            postImage.length > 0 ? "visible" : "hidden"
          } col-span-2 mb-4 w-full text-center justify-items-center`}
        >
          <img alt="" src={postImage} className="w-auto mx-auto" />
        </fieldset>
        <fieldset
          className={`${
            postVideo.length > 0 ? "visible" : "hidden"
          } col-span-2 mb-4 w-full text-center justify-items-center`}
        >
          <video controls className="w-full">
            {postVideo.length > 0 ? (
              <source type={postMedia.mimetype} src={postVideo} />
            ) : (
              ""
            )}
          </video>
        </fieldset>
        <fieldset
          className={`${
            postAudio.length > 0 ? "visible" : "hidden"
          } col-span-2 mb-4 w-full text-center justify-items-center`}
        >
          <audio controls className="w-full">
            {postAudio.length > 0 ? (
              <source type={postMedia.mimetype} src={postAudio} />
            ) : (
              ""
            )}
          </audio>
        </fieldset> */}
        <fieldset
          className={`${
            postType == "media" ? "visible" : "hidden"
          } col-span-2 mb-4`}
        >
          <input
            type="file"
            name="media"
            multiple={true}
            onChange={uploadMedia}
            className="file-input w-full"
          />
        </fieldset>

        <fieldset
          className={`${
            postImages.length > 0 ? "visible" : "hidden"
          } col-span-2 grid grid-cols-4 w-full`}
        >
          {postImages.map((file, i) => {
            return (
              <div key={i} className="col-span-1 h-auto m-2">
                <img
                  key={Math.floor(Math.random() * 10)}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-auto"
                />
              </div>
            );
          })}
        </fieldset>
        <fieldset className={`${postAudios.length > 0 ? "visible" : "hidden"}`}>
          {postAudios.map((file, i) => {
            console.log(file);
            return (
              <audio key={i} controls>
                <source type={file.type} src={URL.createObjectURL(file)} />
              </audio>
            );
          })}
        </fieldset>
        <fieldset className={postVideos.length > 0 ? "visible" : "hidden"}>
          {postVideos.map((file, i) => {
            console.log(file);
            return (
              <video key={i} controls>
                <source type={file.type} src={URL.createObjectURL(file)} />
              </video>
            );
          })}
        </fieldset>
        <fieldset className="col-span-2 mb-4">
          <div className="btn-group w-full justify-center">
            {inlineStyles.map((item, idx) => {
              return (
                <button
                  key={idx}
                  className={`btn ${item.class} ${
                    isStyleActive(item.style) ? "btn-active" : ""
                  }`}
                  onClick={(e) => applyStyle(e, item.style)}
                >
                  {item.icon || item.name}
                </button>
              );
            })}
          </div>
          <div
            className={`textarea textarea-bordered w-full ${
              postType == "post" ? "h-[24rem]" : "h-[6rem]"
            } {postType == "status" ? "text-xl" : ""}`}
          >
            {editor === true ? (
              <Editor
                editorState={editorState}
                onChange={updateEditor}
                handleKeyCommand={handleKeyCommand}
              />
            ) : (
              false
            )}
          </div>
          {/* <textarea id='body' name='body' className={`textarea textarea-bordered w-full ${postType == "post" ? "h-[24rem]" : "h-[6rem]"} {postType == "status" ? "text-xl" : ""}`} onChange={updateBody} placeholder={postBodyPlaceholder[postType]}></textarea> */}
        </fieldset>
        <fieldset className="col-span-1"></fieldset>
        <fieldset className="col-span-1 mb-4 text-right">
          Privacy
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text  text-right">Public</span>
              <input
                type="radio"
                name="privacy"
                value="public"
                className="radio"
                checked={postPublic === true}
                onChange={updatePrivacy}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">For Homies Only</span>
              <input
                type="radio"
                name="privacy"
                value="connections"
                className="radio"
                checked={postPublic === false && postCircles.length == 0}
                onChange={updatePrivacy}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                For{" "}
                <select
                  id="target"
                  name="target"
                  className={`post-type select select-bordered`}
                  onChange={updateCircle}
                >
                  <option value="">Select a circle</option>
                  <optgroup label="Circles">
                    {circles.map((circle, i) => {
                      return (
                        <option key={i} value={circle._id}>
                          {circle.name}
                        </option>
                      );
                    })}
                  </optgroup>
                </select>
              </span>
              <input
                type="radio"
                name="privacy"
                value="circles"
                className="radio "
                checked={postPublic === false && postCircles.length > 0}
                onChange={updatePrivacy}
              />
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
          <button
            id="submitPost"
            name="submitPost"
            className="btn"
            onClick={submitPost}
          >
            Add &nbsp;<span className="uppercase">{postType}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
