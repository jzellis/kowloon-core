/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Merriweather } from "@next/font/google";
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
dayjs.extend(relativeTime);

const Feed = memo((props) => {
  const token = getCookie("token");
  const [items, setItems] = useState(props.items || []);
  const [updated, setUpdated] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);
  const [itemPositions, setItemPositions] = useState([]);
  const [feedIsLoaded, setFeedIsLoaded] = useState(false);

  const loadItems = async () => {
    try {
      const res = await axios.get(`/api/feed?token=${token}`);
      setItems(res.data.items);
      setFeedIsLoaded(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleWindowScroll = async () => {
    setScrollPosition(window.scrollY);
    const uItems = items.map(async (item, i) => {
      if (document.getElementById(item._id).offsetTop < window.scrollY) {
        item.read = true;
        const uPost = await axios.post(`/api/feed?token=${token}`, {
          id: item._id,
          post: { read: true },
        });
      }
      return item;
    });
    //   {
    //   if (document.getElementById(item._id).offsetTop < window.scrollY)
    //     item.read = true;
    //   console.log(item);

    //   return item;
    // });
    //   if (uItems != items) setItems(uItems);
  };

  useEffect(() => {
    const firstLoadItems = async () => {
      await loadItems();
    };
    firstLoadItems();

    // window.addEventListener("scroll", handleWindowScroll);
    // return () => {
    //   window.removeEventListener("scroll", handleWindowScroll);
    // };
  }, [loadItems]);
  return feedIsLoaded ? (
    <ul id="feed" className="mt-8">
      {items.map((item, i) => {
        return (
          <li id={item._id} key={i} className="card dark:bg-slate-800 mb-8">
            <div className="card-body grid grid-cols-8 ">
              <div className="col-span-1 mr-4">
                <a href={item.feed.homeUrl} target="_blank" rel="noreferrer">
                  <img
                    src={item.feed.avatar}
                    className="w-full bg-white h-auto"
                  />
                </a>
              </div>
              <div className="col-span-7">
                <div className="text-md mb-8 font-sans ">
                  <a
                    href={item.feed.homeUrl}
                    target="_blank"
                    className="font-bold"
                    rel="noreferrer"
                  >
                    {item.site}
                  </a>
                </div>

                <div className="card-title">
                  <a
                    href={item.url}
                    className={`hover:link item-title text-2xl ${
                      item.read ? "font-normal" : "font-bold"
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.title}
                  </a>
                </div>
                {item.author ? (
                  <div className="text-gray-400 text-sm">by {item.author}</div>
                ) : (
                  ""
                )}
                <div className="my-8">
                  <img src={item.image} className="w-full h-auto" />
                </div>
                <div
                  className={`item text-md text-gray-600 leading-relaxed text-justify mt-4 mx-2 item-body`}
                  dangerouslySetInnerHTML={{
                    __html: item.content.html
                      ? item.content.html
                      : item.content.description,
                  }}
                ></div>
                <div
                  className="text-sm text-right"
                  title={dayjs(item.pubDate).format("MMM DD,YYYY HH:mma")}
                >
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {dayjs(item.pubDate).fromNow()}
                  </a>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  ) : (
    "Loading feed..."
  );
});

export default Feed;
