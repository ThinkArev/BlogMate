import express from "express";
import { db,connectToDb } from './db' 
// /*npx is not required when wrting nodemon start command in pacakge file
let articlesInfo = [{
    name: 'learn-react',
    upvotes : 0,
    comments : [],
},
{
    name : 'learn-node',
    upvotes : 0,
    comments : [],
}, {
    name: 'mongodb',
    upvotes : 0,
    comments :[],
}]

const app = express();
//middleware - checks what todo with the request
app.use(express.json());
app.get('/api/articels/:name',async (req,res)=>{
    const {name} = req.params
   
    const article = await db.collection('articles').findone({name});

    res.json(article);

})

app.post('/hello',(req,res)=>{
    console.log(req.body);
    res.send(req.body.name);
})

app.put('/api/articles/:name/upvote', async (req,res)=>{
    const { name } = req.params;
    
    await db.collection('articles').updateOne({ name }, {
        $inc : { upvotes : 1 },
    });

    const article = await db.collection('articles').findOne({ name });
    if(article){
        article.upvotes +=1;
        res.send(`The ${name} article nnow has ${article.upvotes} upvotes!!!`);

    }
    else 
    res.send('That article doesn\'t exist');
});


// app.put('/api/articles/:name/upvote', (req,res)=>{
//     const { name } = req.params;
//     const article = articlesInfo.find(a=> a.name === name);

//     if(article){
//         article.upvotes +=1;
//         res.send(`The ${name} article nnow has ${article.upvotes} upvotes!!!`);

//     }
//     else 
//     res.send('That article doesn\'t exist');
// });

app.post('/api/articles/:name/comments',async (req,res)=>{

    const { name } = req.params;
    const { postedBy, text } = req.body;

    await db.collection('articles').updateOne({ name }, {
        $push : { comments : { postedBy, text } },
    });

    const article = await db.collection('articles').findOne({ name });
    console.log(article);
    if(article){
        article.comments.push(req.body);
        console.log(article.comments);
        res.send(article.comments);
    }
    else res.send("the article\' doesnot find");
    })


// app.post('/api/articles/:name/comments',(req,res)=>{

//     const { name } = req.params;
//     const { postedBy, text } = req.body;
//     const article = articlesInfo.find(item => item.name === name);
//     console.log(article);
//     if(article){
//         article.comments.push(req.body);
//         console.log(article.comments);
//         res.send(article.comments);
//     }
//     else res.send("the article\' doesnot find");
//     })

connectToDb(()=>{
console.log('Successfully connected to database');
    app.listen(8000,()=>{
    console.log("app is listening at port 8000");
});

})