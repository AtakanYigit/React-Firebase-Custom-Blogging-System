import {collection, query, orderBy, getDocs} from "firebase/firestore";
import {useLayoutEffect, useState}           from "react";
import {db}      from "../../Firebase";
import {Link}    from "react-router-dom";
import PostImage from "./PostImage";
import "./Home.scss";

const Home = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const blogPostsRef = collection(db, "BlogPosts");
    const q = query(blogPostsRef, orderBy("dateUpdated", "desc"));
    // const q = query(blogPostsRef, orderBy("dateUpdated", "desc"), limit(20));

    useLayoutEffect(() => {
        getDocs(q)
            .then((querySnapshot) => {
                if(querySnapshot.empty){
                    console.log("No blog posts found");
                }else{
                    setBlogPosts(querySnapshot.docs.map((doc) => doc.data()));
                }
            }).catch((error) => {
                console.error("Error getting documents: ", error);
            });
    }, []);

    return (
        <div className = "blog">
            <h1>Welcome to My Blog</h1>
            <div className = "blogPosts">
                {blogPosts.map((post, index) => {
                    return(
                        <Link to = {`/Post/:${post.title.replaceAll(" ", "-")}$${post.id}`} key = {index} className = "post">
                            <div className = "imageContainer">
                                <PostImage source = {post.bannerImageId}/>
                            </div>
                            <div className = "headerDateContainer">
                                <h2>{post.title}</h2>
                                <p>{new Date(post.dateUpdated.seconds * 1000).toLocaleDateString(undefined, {
                                    day:    "2-digit",
                                    month:  "long",
                                    year:   "numeric"})}
                                </p>
                            </div>
                            <p>{post.miniViewText}</p>
                            <p className = "date">{new Date(post.dateUpdated.seconds * 1000).toLocaleDateString(undefined, {
                                day:    "2-digit",
                                month:  "long",
                                year:   "numeric"})}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;