import { useState } from "react";
import Kowloon from "../../lib/Kowloon";
import { useSelector, useDispatch } from 'react-redux';
import { hideImageModal } from "../../../store/ui";

const ImageModal = () => {

    const imageModalOpen = useSelector(state => state.ui.imageModalOpen);
    const imageModalUrl = useSelector(state => state.ui.imageModalUrl);
    const dispatch = useDispatch();

    const hideModal = () => {
        dispatch(hideImageModal());
    }

    return (<div id="imageModal" onClick={hideModal}>
        <div className="bg"></div>
        <div className="wrapper">
            <img src={imageModalUrl} />
        </div>
    </div>)
    
}

export default ImageModal;