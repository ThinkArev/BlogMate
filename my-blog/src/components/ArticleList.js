import { Link } from "react-router-dom";
const ArticleList = ({articles}) => {
  return (
    <div>
        {articles.map((article) => {
        return (
          <Link
            to={`/articles/${article.name}`}
            key={article.name}
            className="article-list-item"
          >
            <h3 className={article.name}> {article.title} </h3>
            <p> {article.content[0].substring(0, 150)}</p>
          </Link>
        );
      })}
    </div>
  )
}

export default ArticleList
