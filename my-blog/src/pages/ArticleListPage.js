import ArticleList from "../components/ArticleList";
import articles from "./article-content";
const ArticleListPage = () => {
  return (
    <div>
      <h1> This is the Article List page!</h1>
        <ArticleList articles={articles}/>
    </div>
  );
};

export default ArticleListPage;
