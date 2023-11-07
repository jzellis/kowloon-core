/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import Kowloon from "../../lib/Kowloon";
import Post from "../Post";
import "./index.css"

/* eslint-disable no-unused-vars */
const Timeline = (props) => {
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    let [page, setPage] = useState(1);
    let [initLoad, setInitLoad] = useState(false);

    const bottom = useRef(null);

    const fetchData = async (page) => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        setLoading(true);
        setShowLoading(true);
        let data = await Kowloon.getPublicTimeline(page);
        if (data && data.items && data.items.length > 0) {
            setPosts([...posts, ...data.items]);
        }
        setLoading(false);
        setShowLoading(false);


     }

    useEffect(() => {
        window && window.scrollTo(0, 0);
        fetchData();
        setInitLoad(true);

    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage(page++);
                console.log(page)
                 fetchData(page);
            }
        })
        observer.observe(bottom.current);
    },[])

const apiServer = import.meta.env.PUBLIC_ENV__API_SERVER;
    return (<div className={`timeline`}>
        {posts && posts.map((post, index) => {
            return (<Post key={`post-${index}`} post={post} />)
        })}
       {loading && (
        <div
          className={showLoading ? "loading" : ""}
          style={{ opacity: showLoading ? 1 : 0 }}
        >
          Loading...
        </div>
      )}
      <div className="w-full mt-48"ref={bottom} />
    </div>)

 }

export default Timeline;