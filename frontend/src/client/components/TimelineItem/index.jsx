import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { FaLink } from "react-icons/fa";

dayjs.extend(relativeTime)
export default function TimelineItem(props) {
    const { _id, type, actor, to, cc, source, likes, quotes, flagged, publicCanReply, characterCount, wordCount, signature, replies, published, updated, id, href, content, attributedTo, title } = props.item;
    const isPublic = props.item.public;
    return (
        <li id={`post_${_id}`} className={`item ${type.toLowerCase()} ${isPublic ? "public" : "private"}`}>
            {title && <div className="title">{title}</div>}
            <div className="meta">
                {actor && <div className="actor">
                    <a href={actor.href}><img src={actor.icon} className="avatar" />{actor.name}</a></div>}
                <div ><FaLink className="inline" /> <a href={href}>{dayjs(published).fromNow()}</a></div>
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
            <ul className="actions">
                <li>Like</li>
                <li>Reply</li>
                <li>Share</li>

            </ul>
        </li>
    )
}