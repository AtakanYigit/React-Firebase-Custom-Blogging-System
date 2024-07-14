import {useLayoutEffect, useState}         from "react";
import {collection, query, where, getDocs} from "firebase/firestore";
import {Link, useParams} from "react-router-dom";
import PostImage         from "./PostImage";
import PostText          from "./PostText";
import {db}              from "../../Firebase";
import "./Post.scss";

const Post = () => {
    let {param} = useParams();
    let postTitle = param.substring(param.indexOf(":") + 1, param.lastIndexOf("$")).replaceAll("-", " ");
    let postId = Number(param.substring(param.lastIndexOf("$") + 1)) || param;

    const [postData, setPostData]  = useState({title: postTitle, content: []});

    const blogPostsRef = collection(db, "BlogPosts");
    const q = query(blogPostsRef, where("id", "==", postId));

    useLayoutEffect(() => {
        getDocs(q)
            .then((querySnapshot) => {
                if(querySnapshot.empty){
                    console.log("No blog posts found");
                    setError(true);
                }else{
                    let data = querySnapshot.docs.map((doc) => doc.data())[0];

                    const dateCreatedFormatted = new Date(data.dateCreated.seconds * 1000).toLocaleDateString(undefined, {
                        day:    "2-digit",
                        month:  "long",
                        year:   "numeric",
                    });
                    data.dateCreated =  dateCreatedFormatted;

                    const dateUpdatedFormatted = new Date(data.dateUpdated.seconds * 1000).toLocaleDateString(undefined, {
                        day:    "2-digit",
                        month:  "long",
                        year:   "numeric",
                    });

                    data.dateUpdated =  dateUpdatedFormatted;
                    setPostData(data);
                }
            }).catch((error) => {
                console.error("Error getting documents: ", error);String
            });
    }, []);

    return (
        <div className = "post">
            <div className = "navButtons">
                <Link to = "/"     className = "navButton">Home</Link>
            </div>
            <Link to = "/Blog" className = "navButtonMobile" style = {{backgroundColor: postData.color}}><p>See Other Posts</p></Link>
            <div className = "headerImageContainer">
                <PostImage source = {postData.bannerImageId} isBanner = {true} pageTitle = {postData.title}/>
            </div>

            <div className = "contentWrapper">
                {postData.ctaLink !== "" &&
                    <a href = {postData.ctaLink} target = "_blank" className = "cta">{postData.ctaLinkText}</a>
                }
                
                {postData.addHyphen 
                    ?<h1>- {postData.title} -</h1>
                    :<h1>{postData.title}</h1>
                }

                {postData.content.map((item, index) => {
                    if(item.type === "Text"){
                        return <PostText key = {index+item.content} content = {item.content}/>;
                    }else if(item.type === "Image"){
                        return (
                            <>
                                <div className = "verticalContainer" key = {index+item.imageId}>
                                    <PostImage key = {index} source = {item.imageId} altText = {item.imageAltHidden}/>
                                    {item.imageAltVisible &&
                                        <PostText content = {item.imageAltVisible}/>
                                    }
                                </div>
                            </>
                        )
                    }else if(item.type === "Link"){
                        return <a className = "link" key = {index+item.displayText} href = {item.link} target = "_blank">{item.displayText}</a>;
                    }else if(item.type === "List"){
                        return <ul key = {index}>{item.content.map((listItem, i) => <li key = {i}>{listItem}</li>)}</ul>;
                    }else if(item.type === "Explanation"){
                        return <p key = {index} className = "explanation"><b className = "bold">{item.word}: </b>{item.explanation}</p>;
                    }else if(item.type === "H1"){
                        return <h1 key = {index}>{item.content}</h1>;
                    }else if(item.type === "H2"){
                        return <h2 key = {index}>{item.content}</h2>;
                    }else if(item.type === "H3"){
                        return <h3 key = {index}>{item.content}</h3>;
                    }else if(item.type === "H4"){
                        return <h4 key = {index}>{item.content}</h4>;
                    }else if(item.type === "H5"){
                        return <h5 key = {index}>{item.content}</h5>;
                    }else if(item.type === "H6"){
                        return <h6 key = {index}>{item.content}</h6>;
                    }
                })}
            </div>
        </div>
    );
}

export default Post;