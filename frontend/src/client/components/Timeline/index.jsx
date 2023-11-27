import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Kowloon from "../../lib/Kowloon";
import TimelineItem from "../TimelineItem";

export default function Timeline(props) {
    const user = useSelector(state => state.user.user);
    const [items, setItems] = useState(props.items || []);
    const [page, setPage] = useState(props.page || 1);
    const [isLoading, setIsLoading] = useState(false);

    const getItems = async (page) => {
        let response = await Kowloon.get(`/outbox?page=${page}`);
        if (!response.error) {
            setItems([...items, ...response.items]);
        }

        return true;
    }

    useEffect(() => {

        if (!items || items.length == 0) {
            setIsLoading(true);
            getItems(page);
            setIsLoading(false);
        }
    },[])
    

    return (
        <div id="timeline">
            <ul className="items">
            {items.map((item, index) => {
                return (
                    <TimelineItem item={item} key={item._id} />
                )
            })}
</ul>
        </div>
    )
}