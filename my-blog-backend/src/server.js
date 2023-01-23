import express from "express";
// import { MongoClient } from 'mongodb'
import { db, connectToDb } from "./db.js";

// /*npx is not required when wrting nodemon start command in pacakge file
// // let articlesInfo = [{
//     name: 'learn-react',
//     upvotes : 0,
//     comments : [],
// },
// {
//     name : 'learn-node',
//     upvotes : 0,
//     comments : [],
// }, {
//     name: 'mongodb',
//     upvotes : 0,
//     comments :[],
// }]

const app = express();
//middleware - checks what todo with the request
app.use(express.json());
app.get('/api/articles/:name', async (req,res)=>{
    const {name} = req.params
    // const client = new MongoClient('mongodb://127.0.0.1:27017');
    // await client.connect();
    // const db = client.db('react-blog-db');
    const article = await db.collection('articles').findOne({name});

    res.json(article);

})

app.post('/hello',(req,res)=>{
    console.log(req.body);
    res.send(req.body.name);
})

app.put('/api/articles/:name/upvote', async (req,res)=>{
    const { name } = req.params;
    // const client = new MongoClient('mongodb://127.0.0.1:27017');
    // await client.connect();
    // const db = client.db('react-blog-db');
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
    // const client = new MongoClient('mongodb://127.0.0.1:27017');
    // await client.connect();
    // const db = client.db('react-blog-db');
    await db.collection('articles').updateOne({ name }, {
        $push : { comments : { postedBy, text } },
    });

    const article = await db.collection('articles').findOne({ name });
    console.log(article);
    if(article){
        console.log(article.comments);
        res.send(article.comments);
    }
    else 
    res.send("the article\' doesnot finded");
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
connectToDb (()=>{
    console.log("SUCCESSfully connected");
    app.listen(8000,()=>{
    console.log("app is listening at port 8000");
});

})