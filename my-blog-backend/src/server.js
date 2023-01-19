import express from "express";

    // /*npx is not required when wrting nodemon start command in pacakge file


const app = express();
//middleware - checks what todo with the request
app.use(express.json());

app.post('/hello',(req,res)=>{
    console.log(req.body);
    res.send(req.body.name);
})


app.get('/hello/:name/goodbye/:otherName',(req,res)=>{
    const { name } = req.params;
    console.log(req.params)
    res.send(`hello ${req.params.name}`);
})

app.listen(8000,()=>{
    console.log("app is listening at port 8000");
});