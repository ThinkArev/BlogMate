import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import useUser from '../hooks/useUser'
const AddCommentForm = ({articleName, onArticleUpdated}) => {
const { user} = useUser();
    const addComment = async () => {

        console.log(name," ", commentText);
        const response = await axios.post(`/api/articles/${articleName}/comments`, {
            postedBy : name,
            text : commentText
        });
        const updatedArticle = response.data;
        onArticleUpdated(updatedArticle);
        setName('');
        setCommentText('');

    }

    const [name, setName] = useState('');
    const [commentText,setCommentText] = useState('');
  return (
    <div id="add-comment-form">
    <h3>Add a Comment</h3>
   {user && <p>you are postng as {user.email}</p>}
    <label>
        Comment:
        <textarea rows="4" cols="50" value={commentText} onChange={(event) => setCommentText(event.target.value)} />
    </label>
    <button onClick={() => addComment()}>Add Comment</button>
</div>
  )
}

export default AddCommentForm