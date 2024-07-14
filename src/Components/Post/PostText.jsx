const PostText = ({content}) => {
    //Detect ${...} and split the content into an array
    const regex = /\${([^}]+)}/g;
    const splitContent = content.split(regex).filter((item)=> item !== "");

    return(
        <p>{splitContent.map((item)=>{
            if(item.startsWith("LINK|")){
                const link = item.slice(item.indexOf("/") + 1, item.length);
                const text = item.slice(4, item.indexOf("/"));
                return <a href = {link} target = "_blank" key = {link}>{text}</a>;
            }else{
                return item;
            }
        })}</p>
    );
}

export default PostText;
	