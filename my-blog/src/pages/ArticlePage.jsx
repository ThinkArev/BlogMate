import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import axios from "axios";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote : false });
  const { canUpvote} = articleInfo;
  const params = useParams();
  const articleId = params.articleId;

  const { user, isLoading } = useUser();

  useEffect(() => {
    console.log("this is useEffect in articlePage");
    const loadArticles = async () => {
      const token = user && await user.getIdtoken();
      const response = await axios.get(`/api/articles/${articleId}`,{
        header : { authtoken : token}, 
      });
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };
if(isLoading){
  loadArticles();

}
  }, [user,isLoading]);

  const article = articles.find((article) => article.name === articleId);

  const addUpvote = async () => {
    const response = await axios.put(`/api/articles/${articleId}/upvote`);
    const updateArticle = response.data;
    setArticleInfo(updateArticle);
  };

  if (!article) {
    return <NotFoundPage />;
  }
  return (
    <>
      <h1>{article.title}</h1>
      <div className="upvote-section">
        { user 
        ? <button onClick={addUpvote}>{canUpvote ? "Upvote" : "already upvoted"}</button> 
        : <Link to='/login'><button>Log in to upvote</button></Link>}
        <p>This article has {articleInfo.upvotes} upvotes(s)</p>
      </div>
      {article.content.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
      <CommentList comments={articleInfo.comments} />
      {user ? 
      <AddCommentForm articleName={articleId}  onArticleUpdated={(updatedInfo)=>{setArticleInfo(updatedInfo)}}/>
    : <Link to='/create-account'><button>Log in to add comment</button> </Link>}
    </> 
  );
};

export default ArticlePage;
