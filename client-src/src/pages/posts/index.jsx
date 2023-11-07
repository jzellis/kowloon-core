
import FullPost from "../../components/FullPost";
import Kowloon from "../../lib/Kowloon";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }) {
    const post = await Kowloon.getPost(params.id);
    return post;
  }
const Post = () => { 

    const post = useLoaderData();

    return (<><div><a href={`${document && document.referrer}`}>← Back</a></div><FullPost post = {post} /></>)
}

export default Post;