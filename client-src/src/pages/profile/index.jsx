import FullPost from "../../components/FullPost";
import Kowloon from "../../lib/Kowloon";
import { useSelector, useDispatch } from "react-redux";
import { useLoaderData } from "react-router-dom";
import {FaMapMarkerAlt ,FaLink} from 'react-icons/fa'
import "./index.css"
import { useEffect, useState } from "react";
import { setPosts } from "../../store/posts";

export async function loader({ params }) {


  return params.username;
}
const Profile = () => {
  const username = useLoaderData();
  const user = useSelector(state => state.ui.user);
  const page = useSelector(state => state.ui.page);
  const posts = useSelector(state => state.posts);
  const [profile, setProfile] = useState({});

  const dispatch = useDispatch();

  const loadData = async () => {
    setProfile(await Kowloon.getUser(username));
    let userPosts = await Kowloon.getUserPosts(username, page);
    dispatch(setPosts(userPosts.items));
  }

  useEffect(() => {
    loadData();
  },[])

  const toggleFollow = async () => {
    if (user && user.actor && user.actor.id != profile.id) {
      await Kowloon.post(`/users/${profile.id}/follow`, user.actor.id);
      profile.followers = profile.followers + 1;
    }
  }

  return (<div  className="timeline">{profile && profile.location &&  <div className="profile">
    <div className="card w-full bg-base-100 shadow-xl">
      <figure><img src={profile.icon} alt="Shoes" className="h-24" /></figure>
      <div className="card-body">
        <h2 className="card-title">{profile.name} <span className="text-sm">({profile.id})</span></h2>
        <div className="location"><a href={`//maps.google.com?q=${encodeURIComponent(profile.location.name)}`} target="_blank"><FaMapMarkerAlt className="inline mr-1" />{profile.location.name}</a></div>
        <p>{profile.bio}</p>
        <ul className="urls text-sm">
          {profile && profile.url && profile.url.map((url) => <li key={url}><a className="link" href={url} target="_blank"><FaLink className="inline mr-1" />{url}</a></li>)}
        </ul>
        <div className="card-actions justify-end">
          {user && user.actor && user.actor.id != profile.id &&
            <button className="btn btn-primary">Follow</button>
          }
        </div>
      </div>
    </div>
    {posts && <div>
      {posts && posts.items && posts.items.map((post) => <FullPost key={post.id} post={post} />)}
    </div>}
  </div>
  }</div>);
};

export default Profile;
