import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {useEffect, useState} from "react";

const PostImage = ({source, isBanner = false, imageAltTextHidden = "", pageTitle = ""}) => {
    const [imageURL, setImageURL] = useState("");
    const storage = getStorage();

    useEffect(() => {
        if(!source) return;
        getDownloadURL(ref(storage, `BlogPostImages/${source}.webp`))
            .then((url) => {
                setImageURL(url);
            }).catch((error) => {
                console.error("Error getting documents: ", error);
            });
    }, [source]);

    return(
        <img src = {imageURL} className = {`${isBanner ? "headerImage" : ""} noSelect`} alt = {isBanner ? pageTitle : imageAltTextHidden}/>
    );
}

export default PostImage;