/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Kowloon from "../../lib/Kowloon";
import Post from "../Post";

/* eslint-disable no-unused-vars */
const Timeline = (props) => {

    const [posts, setPosts] = useState([]);

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        let data = await Kowloon.getPublicTimeline();
        console.log(data)
        setPosts(data.items);

     }

    useEffect(() => { 



    fetchData();


    }, [])

const apiServer = import.meta.env.PUBLIC_ENV__API_SERVER;
    return (<div className={`timeline ${props.className}`}>
        {posts && posts.map((post, index) => {
            return (<Post key={`post-${index}`} post={post} />)
         })}
    </div>)

 }

export default Timeline;