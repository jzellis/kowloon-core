/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
const Post = (props) => {
    const post = props.post;
    const {id, type, title, actor, likes, replies, quotes, content, published, url} = post;
    return (
        <div className="post">
            <div className="post-header">
                <div className="post-actor flex">
                    {actor &&
                    <><div className="post-actor-avatar w-[32px]"><img src={actor.icon} alt={actor.name} /></div>
                    <div className='flex-none'>
                        <div><a href={`/users/${actor.preferredUsername}`}><span className='actor-name'>{actor.name}</span> <span className='actor-username'>(actor.preferredUsername)</span></a></div>
                        {title && <h2 className="title">{title}</h2>}
                        <div className="post-meta"><a href={id} className='hover:underline'>{dayjs(published).fromNow()}</a></div>
                        </div>
                        </>
                    }
                </div>

            </div>
            <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
            <div className='w-[90%] mx-auto divider'></div>
            <div className='w-[90%] text-right mx-auto text-sm '>{likes.length} likes | {replies.length} replies | {quotes.length} quotes</div>
        </div>
    )

 }

export default Post;