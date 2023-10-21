/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Kowloon from "../../lib/Kowloon";
import Post from "../Post";
import { setPosts } from "../../../store/posts"
/* eslint-disable no-unused-vars */
const Timeline = (props) => {

    const posts = useSelector(state => state.posts.items);
    const dispatch = useDispatch();

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        let data = await Kowloon.getPublicTimeline();
        console.log(data)
        dispatch(setPosts(data.items))

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