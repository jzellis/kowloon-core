/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showImageModal, hideImageModal } from '../../store/ui';
import { BsLink45Deg } from 'react-icons/bs'
import Kowloon from '../../lib/Kowloon';

dayjs.extend(relativeTime)
const FullPost = (props) => {
    const user = useSelector((state) => state.ui.user);
    const likeEmojis = useSelector((state) => state.ui.settings.likeEmojis);
    const post = props.post;
    console.log(post)

    const { id, type, title, actor, likes, replies, quotes, content, published, publicCanReply, href } = post;
    const isPublic = post.public;
    const postRef = useRef();
    const dispatch = useDispatch();
    const isLiked = likes.filter(e => e.actor === user.actor.id).length > 0;

    const [replyBody, setReply] = useState("");
    const [visibleLikesDialog, setVisibleLikesDialog] = useState(false); // [visibleLikesDialog]
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

    const likePost = async (emoji) => {
        const activity = {
            actor: user.actor.id,
            target: post.id,
            type: "Like",
            object: { ...emoji, actor: user.actor.id }
        }

        console.log(activity)

    }

    const postReply = async (e) => {
        e.preventDefault();

        const reply = {
            actor: user.actor.id,
            replyTo: post._id,
            source: {
                content: replyBody,
                mediaType: "text/html",
            },

        }
console.log(reply)
        await Kowloon.addReply(reply);
    }

    return (
    <>

        <div className={`post post-full ${post.type.toLowerCase()}}`}>
            <div className="post-header">
                {actor && <div className="post-actor flex">
                    <><div className="post-actor-avatar w-[32px]"><img className='w-full h-full' src={actor.icon} title={actor.name} alt={actor.name} /></div>
                        <div className='flex-none'>
                            <div><a href={`/users/${actor.preferredUsername}`}><span className='actor-name'>{actor.name}</span> <span className='actor-username'>{actor.preferredUsername}</span></a></div>
                            {(title && post.type != "Link") && <h2 className="post-title">{title}</h2>}
                            {(post.type == "Link" && title) && <h2 className="post-title"><a href={href} className='font-bold' target='_blank'><BsLink45Deg className='inline' /> {title}</a></h2>}
                            <div className="post-meta"><a href={id} className='hover:underline'>{dayjs(published).fromNow()}</a></div>
                        </div>
                    </>
                    
                </div>
                }
            </div>
            {(post.featuredImage && type != "Link") && <div className="post-featured-image"><img className='w-full' src={post.featuredImage} /></div>}
            {(post.featuredImage && type == "Link") && <div className="post-featured-image"><a href={href} className='font-bold' target='_blank'><img className='w-full' src={post.featuredImage} /></a></div>}
            {post.attachment && <ul className="post-attachments my-4 w-full flex gap-2">
                {post.attachment.map((a) => <li className='rounded-lg cursor-pointer w-1/4 aspect-square overflow-hidden hover:border-2 border-blue-500' onClick={e => showAttachment(a.href)}><img className='min-w-full min-h-full' key={`attachment-${a}`} src={a.href} /></li>)}</ul>}
            <div ref={postRef} className="post-content" dangerouslySetInnerHTML={{ __html: content }} />

                <div className='text-right mx-auto text-sm'>
                    <span className={`likes text-2xl group relative cursor-pointer`} onClick={() => {setVisibleLikesDialog(!visibleLikesDialog)}}><span className={`hover:grayscale-0 ${!isLiked ? 'grayscale' : 'grayscale-0'}`}>❤️</span>
                        <div className={`transition-opacity ${visibleLikesDialog ? 'opacity-100' : 'opacity-0'} like-popup absolute left=1/2 -translate-x-1/2 bottom-0 translate-y-full text-3xl bg-gray-100 shadow-xl p-2 rounded-lg w-[24rem] text-center overflow-visible`}>
                            {likeEmojis && likeEmojis.map((emoji) => <span key={emoji.name} className='tooltip mx-1 transition-opacity hover:opacity-100 opacity-50' onClick={e => likePost(emoji)} data-tip={emoji.name}>{emoji.emoji}</span>)}
                            </div>
                    </span> | {replies && replies.length} replies | {quotes && quotes.length} quotes
                </div>
                <ul className='replies relative mt-4 mx-10 text-sm'>
                    {replies && replies.map((reply) => (
                        <li key={reply.id} className='reply'><a name="replies" />
                            <div className='flex w-full'>
                                <div className='actor font-bold flex-1'><a href={`/users/${reply.actor.preferredUsername}`}>{reply.actor.name}</a></div>
                                <div className='flex-none'>{dayjs(reply.published).fromNow()}</div>

                            </div>
                            <div className='ml-4'>{reply.content}</div>
                        </li>
                    ))}
                </ul>
                {user && <div className='reply-editor relative'>
                    <textarea className='w-full' placeholder='Write a reply...' onChange={(e) => setReply(e.target.value)} />
                    <div className='text-right'> <button onClick={postReply} className='btn btn-primary'>Reply</button></div>
                </div>
                }
        </div>
            
            </>
    )

 }

export default FullPost;