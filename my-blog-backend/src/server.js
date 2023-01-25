import express from "express";
import fs from "fs";
import admin from "firebase-admin";
// import { MongoClient } from 'mongodb'
import { db, connectToDb } from "./db.js";
import { fileURLToPath } from "url";
import path from "path";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = fs.readFileSync("./credentials.json");
const credentials = JSON.parse(file);
console.log(credentials);
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
const app = express();
//middleware - checks what todo with the request
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/, (req,res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
})
app.use(async (req, res, next) => {
  const { authtoken } = req.headers;
  if (authtoken) {
    try {
      const user = await admin.auth().verifyIdToken(authtoken);
      req.user = user;
    } catch (e) {
      return res.sendStatus(400);
    }
  }
  req.user = req.user || {};
  next();
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  // const client = new MongoClient('mongodb://127.0.0.1:27017');
  // await client.connect();
  // const db = client.db('react-blog-db');

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.include(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
  console.log(article);
});

app.post("/hello", (req, res) => {
  console.log(req.body);
  res.send(req.body.name);
});

//put middleware
app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
});
app.put("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });
  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.include(uid);
    if (canUpvote) {
      await db.collection("articles").updateOne(
        { name },
        {
          $inc: { upvotes: 1 },
          $push: { upvoteIds: uid },
        }
      );
      //
    }
    const updatedArticle = await db.collection("articles").findOne({ name });
    res.json(updatedArticle);
  } else res.send("That article doesn't exist");
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

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  // const client = new MongoClient('mongodb://127.0.0.1:27017');
  // await client.connect();
  // const db = client.db('react-blog-db');
  await db.collection("articles").updateOne(
    { name },
    {
      $push: { comments: { postedBy, text } },
    }
  );

  const article = await db.collection("articles").findOne({ name });
  console.log(article);
  if (article) {
    console.log(article.comments);
    res.json(article);
  } else res.send("the article' doesnot finded");
});

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
const PORT = process.env.PORT ||  8000

connectToDb(() => {
  console.log("SUCCESSfully connected");
  app.listen(PORT, () => {
    console.log("app is listening at port 8000 " + PORT);
  });
});
