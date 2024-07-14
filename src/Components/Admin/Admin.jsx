import {doc, getDoc, setDoc, collection, getDocs, query, where, updateDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import deleteButton          from "../../assets/DeleteButton.png";
import addButton             from "../../assets/AddButton.png";
import {db}                  from "../../Firebase";
import {getAuth}             from 'firebase/auth';
import "./Admin.scss";

const Admin = () => {
    //If not authenticated redirect to AdminEntrance
    const [ctaLink, setCtaLink] = useState("");
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    useEffect(() => {
        getAuth().onAuthStateChanged((user) => {
            if(user){
                setIsUserAuthenticated(true);
                console.log("Access Granted");
            }else{
                setIsUserAuthenticated(false);
                console.log("Access Denied");
                window.location.href = "/AdminEntrance";            
            }
        });
    }, []);

    const [contents,      setContents]      = useState([{type: "Text", content: "", id: 0}]);
    const [lastUsedId,    setLastUsedId]    = useState(1);
    const [blogPostCount, setBlogPostCount] = useState(0);
    const blogPostCountRef = doc(db, "BlogPostCount", "BlogPostCount");
    const blogPostsRef     = collection(db, "BlogPosts");

    const publishBlogPost = async (e) => {
        e.preventDefault();

        //Check if user is authenticated
        if(window.localStorage.getItem("uid") === null || isUserAuthenticated === false){
            alert("You are not authenticated!");
            return;
        }
        console.log(e.target.title.value);

        const newBlogPost = {
            id:            blogPostCount + 1,
            title:         e.target.title.value,
            bannerImageId: e.target.bannerImageId.value,
            ctaLink:       ctaLink,
            ctaLinkText:   e.target.ctaLinkText.value,
            color:         e.target.color.value,
            miniViewText:  e.target.miniViewText.value,
            tags:          e.target.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== ""),
            content:       contents,
            dateUpdated:   new Date(),
            dateCreated:   new Date()
        };

        try{
            //Update Blog Post Count
            setDoc(blogPostCountRef, {BlogPostCount: blogPostCount + 1});

            //Create New Blog Post
            await Promise.all([
                setDoc(doc(db, "BlogPosts", `${blogPostCount + 1}-${title}`), newBlogPost),
                setBlogPostCount(blogPostCount + 1)
            ]);
            alert("Post Published!");
        }catch(error){
            alert("Error adding document: ", error);
        }
    }

    const updateHandler = (e) => {
        e.preventDefault();
        const postId = Number(e.target[0].value);
        const index  = Number(e.target[1].value);

        //Add {content: "",id: [random high number], type: "Text"} to the post with postId at index
        let updatedContents;
        const q = query(blogPostsRef, where("id", "==", postId));
        getDocs(q)
            .then((querySnapshot) => {
                if(querySnapshot.empty){
                    console.log("No blog posts found");
                }else{
                    updatedContents = querySnapshot.docs[0].data().content;
                    updatedContents.splice(index, 0, {content: "", id: Math.floor(Math.random() * 1000000), type: "Text"});

                    updateDoc(querySnapshot.docs[0].ref, {content: updatedContents})
                        .then(() => {
                            alert("Document successfully updated!");
                        }).catch((error) => {
                            console.error("Error updating document: ", error);
                        });
                }
            }).catch((error) => {
                console.error("Error getting document:", error);
            });

    }

    useEffect(() => {
        getDoc(blogPostCountRef)
            .then((docSnap) => {
                if (docSnap.exists()){
                    setBlogPostCount(Number(docSnap.data().BlogPostCount));
                }else{
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.error("Error getting document:", error);
            })
    }, []);

    const selectChangeHandler = (e, {index}) => {
        const selectedValue = e.target.value;
        setContents(contents.map((item, i) => {
            if(i === index){
                return {type: selectedValue, content: "", id: item.id};
            }else{
                return item;
            }
        }));
    }

    return (
        <div className = "admin">
            <h1>Publish Post</h1>
            <form onSubmit = {publishBlogPost}>
                <h2>General Info</h2>
                <input type = "text" placeholder = "Title"           name = "title"/>
                <input type = "text" placeholder = "Banner Image Id" name = "bannerImageId"/>
                <input type = "text" placeholder = "Mini View Text"  name = "miniViewText"/>
                <input type = "text" placeholder = "CTA Link"        value = {ctaLink} onChange = {(e) => setCtaLink(e.target.value)}/>
                {ctaLink !== "" &&
                    <input type = "text" placeholder = "CTA Link Text" name = "ctaLinkText"/>
                }
                <input type = "text" placeholder = "Tags"  name = "tags"/> 
                <input type = "text" placeholder = "color" name = "color"/>

                <h2>Content</h2>
                <img src = {addButton} className = "addButton" alt = "Add" onClick = {() => {
                    setLastUsedId(lastUsedId + 1);
                    setContents([...contents, {type: "Text", content: "", id: lastUsedId}])
                }}/>

                {contents.map((content, index) => {
                    return(
                        <div key = {content.id} className = "contentContainer" id = {content.id}>
                            <div className = "horizontal">
                                <select selected = {content.type} onChange = {(e)=> selectChangeHandler(e, {index})}>
                                    <option value = "Text" >Text</option>
                                    <option value = "Image">Image</option>
                                    <option value = "Link" >Link</option>
                                    <option value = "Explanation" >Explanation</option>
                                    {/* <option value = "List" >List</option> */}
                                    <option value = "H1"   >H1</option>
                                    <option value = "H2"   >H2</option>
                                    <option value = "H3"   >H3</option>
                                    <option value = "H4"   >H4</option>
                                    <option value = "H5"   >H5</option>
                                    <option value = "H6"   >H6</option>
                                </select>
                                <img src = {deleteButton} className = "deleteButton" alt = "Delete" onClick = {() => setContents(contents.filter((item, i) => i !== index))}/>
                            </div>

                            {(content.type === "Text" || content.type === "H1" || content.type === "H2" || content.type === "H3" || content.type === "H4" || content.type === "H5" || content.type === "H6") &&
                                <input type = "text" placeholder = {content.type} value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, content: e.target.value} : item))}/>
                            }

                            {content.type === "Image" &&
                                <>
                                    <input type = "text" placeholder = "Image Id"              value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, imageId: e.target.value} : item))}/>
                                    <input type = "text" placeholder = "Image Alt Text Hidden" value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, imageAltHidden:  e.target.value} : item))}/>
                                    <input type = "text" placeholder = "Image Alt Text"        value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, imageAltVisible: e.target.value} : item))}/>
                                </>
                            }

                            {content.type === "Link" &&
                                <>
                                <p>To insert link in text add <b>${"\{"}LINK[DisplayText]/ActualLink{"\}"}</b></p>
                                    <input type = "text" placeholder = "Link"         value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, link: e.target.value} : item))}/>
                                    <input type = "text" placeholder = "Display Text" value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, displayText: e.target.value} : item))}/>
                                </>
                            }

                            {content.type === "Explanation" &&
                                <>
                                    <input type = "text" placeholder = "Explaining Word" value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, word: e.target.value} : item))}/>
                                    <input type = "text" placeholder = "Explanation"     value = {content.value} onChange = {(e) => setContents(contents.map((item, i) => i === index ? {...item, explanation: e.target.value} : item))}/>
                                </>
                            }

                            {/* {content.type === "List" &&
                                <input type = "text" placeholder = "List Item" name = "" id = "" />
                            } */}
                        </div>
                    )
                })}

                <input type = "submit" value = "Publish"/>
            </form>

        </div>
    );
}

export default Admin;