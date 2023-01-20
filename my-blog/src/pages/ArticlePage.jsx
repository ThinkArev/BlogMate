import { useState , useEffect} from "react";
import {useParams} from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvotes : 0, comments : []});
    
  useEffect(()=>{
    console.log("this is useEffect");
    setArticleInfo({upvotes : Math.ceil(Math.random() * 10), comments : []});
  },[])
    const params = useParams();
    const   articleId  = params.articleId;
    const article = articles.find(article => article.name === articleId );
    if(!article){
      return (<NotFoundPage />)
    }
    return (
      <>
      <h1>{article.title}</h1>
      <p>This article has {articleInfo.upvotes} upvotes(s)</p>
      {article.content.map((item,index) => (<p key={index}>{item}</p>)
        )} 

      </>
        
    )
}


export default ArticlePage;

