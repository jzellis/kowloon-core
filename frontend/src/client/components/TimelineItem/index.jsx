import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "./index.css"
import { FaLink } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";

dayjs.extend(relativeTime)
export default function TimelineItem(props) {
    const { _id, type, actor, to, cc, source, likes, quotes, flagged, publicCanReply, characterCount, wordCount, signature, replies, published, updated, id, href, content, featuredImage,attributedTo, title, link } = props.item;
    const isPublic = props.item.public;
    return (
        <li id={`post_${_id}`} className={`item ${type} ${isPublic ? "public" : "private"}`}>

                <div className="actor"><a href={actor.href} target="_blank">
                <div className="icon">
                        <img src={actor.icon} />
                        </div>
                    </a>
                </div>
                <div className="main-content">
                    {title && <h2 className="title"><a href={href}>{title}</a></h2>}
                <div className="meta"><a href={actor.href} className="name" target="_blank">{actor.name}</a> | <a href={href}><FaLink className="inline h-[0.8em] -mt-1" /> {dayjs(published).fromNow()}</a></div>
                {featuredImage && <div className="featuredImage">{link && <a href={link}><img src={featuredImage.url} /></a>}{!link && <img src={featuredImage.url} />}</div>}
                <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
                <div className="meta">
                    
                </div>
                <ul className="actions">
                <li><AiOutlineLike className="inline" /> Like</li>
                <li>Reply</li>
                <li>Share</li>

                    </ul>
            </div>


            {/* <div className="flex">
            <div className="meta w-24">
                {actor && <div className="actor">
                    <a href={actor.href}><img src={actor.icon} className="avatar" /></a></div>}
                
                </div>
                <div className="w-full">
                <div ><FaLink className="inline" /> <a href={href}>{dayjs(published).fromNow()}</a></div>
            {type != "Link" &&
            <>{featuredImage && <div className="image"><img src={featuredImage.url} /></div>}
            
            }
            
            {type == "Link" &&
            <a href={link} className="link_body" target="_blank">{featuredImage && <div className="image"><img src={featuredImage.url} /></div>}
            <div className="content" dangerouslySetInnerHTML={{ __html: content }} /></a>
    }
            <ul className="actions">
                <li>Like</li>
                <li>Reply</li>
                <li>Share</li>

                    </ul>
                    </div>
                </div> */}
        </li>
    )
}