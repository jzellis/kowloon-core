import { useState } from "react"
import Kowloon from "../../lib/Kowloon";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
export default function Setup() {

    const pronounChoices = {
        they: {
            subject: 'they',
            object: 'them',
            possAdj: 'their',
            possPro: 'theirs',
            reflexive: 'themselves'
        },
        she: {
            subject: 'she',
            object: 'her',
            possAdj: 'her',
            possPro: 'hers',
            reflexive: 'herself'
        },
        he: {
            subject: 'he',
            object: 'him',
            possAdj: 'his',
            possPro: 'his',
            reflexive: 'himself'
        }
    };

    const defaultEmojis = [
        {
          name: 'Like',
          emoji: '👍'
        },
        {
          name: 'Love',
          emoji: '❤️'
        },
        {
          name: 'Sad',
          emoji: '😭'
        },
        {
          name: 'Angry',
          emoji: '🤬'
        },
        {
          name: 'Shocked',
          emoji: '😮'
        },
        {
          name: 'Puke',
          emoji: '🤮'
        }
      ]

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState({});
    const [domain, setDomain] = useState("");
    // const [asDomain, setAsDomain] = useState("");
    const [pronouns, setPronouns] = useState(pronounChoices.they);
    const [emojis, setEmojis] = useState(defaultEmojis);
    const [siteIcon, setSiteIcon] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [userIcon, setUserIcon] = useState("");
    const [url, setUrl] = useState(window.location.hostname);
    const [error, setError] = useState("");
    const navigate = useNavigate();

      const doSetup = async (e) => {
          e.preventDefault();
          let data = new FormData(e.target);
          console.log(data);
          let response = await (await fetch(Kowloon.endpoint + "/setup", {
              headers: { "Accept": "application/json" },
              method: "POST",
              body: data
          })).json();
          if (response.error) {
              setError(response.error);
          } else {
              navigate("/login");
          }
      }

    return (
        <div id="setup" className="px-8">

            <h1>Setup</h1>
            <form onSubmit = {doSetup} className="w-1/3 mx-auto mb-40">
            <div className="divider">Site Info</div>

                <fieldset><label htmlFor="title" className="label"><span className="label-text">Site Title</span></label><input type="text" className="input input-bordered w-full" name="title" onChange={e => setTitle(e.target.value)} placeholder="My Kowloon Server" /></fieldset>
            <fieldset><label htmlFor="description" className="label"><span className="label-text">Site Description</span></label><textarea name="description" className="textarea textarea-bordered w-full" onChange={e => setDescription(e.target.value)} placeholder="This is my kowloon server. There are many like it but this one is mine."></textarea></fieldset>
            <fieldset><label htmlFor="location" className="label"><span className="label-text">Location (optional)</span></label><input type="text" className="input input-bordered w-full" name="location" onChange={e => setLocation(e.target.value)} placeholder="Kowloon, Hong Kong" /></fieldset>
            <fieldset><label htmlFor="domain" className="label"><span className="label-text">Domain</span></label><input type="text" className="input input-bordered w-full" name="domain" defaultValue={window.location.hostname} onChange={e => setDomain(e.target.value)} /></fieldset>
                <fieldset><label htmlFor="siteIcon" className="label"><span className="label-text">Site image</span></label><input type="file" className="file-input" name="siteIcon" onChange={e => setSiteIcon(e.target.value)} /></fieldset>
                <div className="divider mt-16">Admin User</div>
                <fieldset><label htmlFor="username" className="label"><span className="label-text" onChange={(e) => setUsername(e.target.value)}>Username</span></label><input type="text" name="username" className="input input-bordered w-full" /></fieldset>
                <fieldset><label htmlFor="name" className="label"><span className="label-text">Full/Display Name</span></label><input type="text" name="name" className="input input-bordered w-full" onChange={(e) => setName(e.target.value)} placeholder="Jane Smith, The Rudy, whatever" /></fieldset>
                <fieldset><label htmlFor="password" className="label"><span className="label-text">Password</span></label><div className="join w-full"><input type={showPassword ? "text" : "password"} className="input input-bordered w-full" onChange={(e) => setPassword(e.target.value)} name="password" /><button className="btn" onClick={e => { e.preventDefault(); setShowPassword(!showPassword) }}>{showPassword ? <IoEye /> : <IoEyeOff /> }</button></div></fieldset>
                <fieldset><label htmlFor="email" className="label"><span className="label-text">Email Address</span></label><input type="email" name="email" className="input input-bordered w-full" onChange={(e) => setEmail(e.target.value)} /></fieldset>
                <fieldset><label htmlFor="bio" className="label"><span className="label-text">Bio</span></label><textarea className="textarea textarea-bordered w-full" name="bio" onChange={(e) => setBio(e.target.value)}></textarea></fieldset>
                <fieldset><label htmlFor="userIcon" className="label"><span className="label-text">User avatar</span></label><input type="file" className="file-input" name="userIcon" onChange={e => setUserIcon(e.target.value)} /></fieldset>
                <fieldset><label htmlFor="url" className="label"><span className="label-text">Url</span></label>
                    <input name="url"  className="input input-bordered w-full" placeholder="https://example.com" onChange={e => setUrl(e.target.value)} />

                </fieldset>
                {error && <fieldset className="text-red-500">{error}</fieldset>}
                <div className="w-full text-center mt-8"><button type="submit" className="btn btn-primary btn-wide">Go</button></div>
            </form>
        </div>
    )
}