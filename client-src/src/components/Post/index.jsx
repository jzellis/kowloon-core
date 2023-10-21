/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useRef, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux';
import { showImageModal, hideImageModal } from '../../../store/ui';
import { BsLink45Deg } from 'react-icons/bs'

dayjs.extend(relativeTime)
const Post = (props) => {
    const post = props.post;
    const { id, type, title, actor, likes, replies, quotes, content, published, href } = post;
    const postRef = useRef();
    const dispatch = useDispatch();
    
    useLayoutEffect(() => {
        
        if (postRef.current) {
            
            let links = Array.from(postRef.current.getElementsByTagName("a"));
            links.map((a) => {
                a.setAttribute("target", "_blank")
            })
        }

    }, [])
    
    const showAttachment = (url) => {
        dispatch(showImageModal(url))
    }
    return (
        <div className="post">
            <div className="post-header">
                <div className="post-actor flex">
                    <><div className="post-actor-avatar w-[32px]"><img className='w-full h-full' src={actor.icon} title={actor.name} alt={actor.name} /></div>
                    <div className='flex-none'>
                            <div><a href={`/users/${actor.preferredUsername}`}><span className='actor-name'>{actor.name}</span> <span className='actor-username'>{actor.preferredUsername}</span></a></div>
                            {(title && post.type != "Link") && <h2 className="post-title">{title}</h2>}
                            {(post.type == "Link" && title) && <h2 className="post-title"><a href={href} className='font-bold' target='_blank'><BsLink45Deg className='inline' /> {title}</a></h2>}
                        <div className="post-meta"><a href={id} className='hover:underline'>{dayjs(published).fromNow()}</a></div>
                        </div>
                        </>
                    
                </div>

            </div>
            {(post.featuredImage  && type != "Link") && <div className="post-featured-image"><img className='w-full' src={post.featuredImage} /></div>}
            {(post.featuredImage && type == "Link") && <div className="post-featured-image"><a href={href} className='font-bold' target='_blank'><img className='w-full' src={post.featuredImage} /></a></div>}
            {post.attachment && <ul className="post-attachments my-4 w-full flex gap-2">
                {post.attachment.map((a) => <li className='rounded-lg cursor-pointer w-1/4 aspect-square overflow-hidden hover:border-2 border-blue-500' onClick={e => showAttachment(a.href)}><img className='min-w-full min-h-full' key={`attachment-${a}`} src={a.href} /></li>)}</ul>}
            <div ref={postRef} className="post-content" dangerouslySetInnerHTML={{ __html: content }} />


            <div className='w-[90%] mx-auto divider'></div>
            <div className='w-[90%] text-right mx-auto text-sm '>{likes.length} likes | {replies.length} replies | {quotes.length} quotes</div>
        </div>
    )

 }

export default Post;