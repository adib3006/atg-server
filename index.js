const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5voiazn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const usersCollection = client.db('ATG').collection('users');
        const postsCollection = client.db('ATG').collection('posts');

        //user registration
        app.post('/registration',async (req,res)=>{
            const user = req.body;
            const query = {email:user.email};
            const exist = await usersCollection.findOne(query);
            if(exist){
                res.send('Email already exists !');
                return;
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        //user login
        app.get('/login', async(req,res)=>{
            const user = req.body;
            const query = {email:user.email,password:user.password};
            const result = await usersCollection.findOne(query);
            if(!result){
                res.send('Wrong credentials');
                return;
            }
            res.send(result);
        })

        //create post
        app.post('/post', async(req,res)=>{
            const post = req.body;
            const postDate = new Date();
            const postWithDate = {...post,postDate};
            const result = await postsCollection.insertOne(postWithDate);
            res.send(result);
        })

        //read posts by email
        app.get('/post', async(req,res)=>{
            let query = {};
            const email = req.query.email;
            if(email){
                query = {email:email}
            }
            const result = await postsCollection.find(query).toArray();
            res.send(result);
        })

        //read post by id
        app.get('/post/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await postsCollection.findOne(query);
            res.send(result);
        })

        //update post
        app.patch('/post/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const post = req.body;
            const updatedPost = {$set : post};
            const result = await postsCollection.updateOne(query,updatedPost);
            res.send(result);
        })

        //delete post
        app.delete('/post/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await postsCollection.deleteOne(query);
            res.send(result);
        })

        //like post
        app.patch('/post/like/:id', async(req,res)=>{
            const id = req.params.id;
            const {userEmail} = req.body;
            const userQuery = {email : userEmail};
            const user = await usersCollection.findOne(userQuery);
            if(!user){
                res.send('user not registered');
                return;
            }
            const liked = user.liked;
            liked.push(id);
            const updatedLiked = {$set : {liked : liked}}
            const userResult = await usersCollection.updateOne(userQuery,updatedLiked);

            const postQuery = {_id: ObjectId(id)};
            const post = await postsCollection.findOne(postQuery);
            const likes = post.likes;
            likes.push(userEmail);
            const updatedPost = {$set : {likes : likes}};
            const postResult = await postsCollection.updateOne(postQuery,updatedPost);

            res.send({userResult, postResult});
        })

        //comment on a post
        app.patch('/post/comment/:id', async(req,res)=>{
            const id = req.params.id;
            const {userEmail} = req.body;
            const {userName} = req.body;
            const {comment} = req.body;
            const userQuery = {email : userEmail};
            const user = await usersCollection.findOne(userQuery);
            console.log(userEmail,user);
            if(!user){
                res.send('user not registered');
                return;
            }
            const commented = user.commented;
            commented.push(id);
            const updatedCommented = {$set : {commented : commented}}
            const userResult = await usersCollection.updateOne(userQuery,updatedCommented);

            const postQuery = {_id: ObjectId(id)};
            const post = await postsCollection.findOne(postQuery);
            const comments = post.comments;
            const newComment = {
                userEmail,
                userName,
                comment
            }
            comments.push(newComment);
            const updatedPost = {$set : {comments : comments}};
            const postResult = await postsCollection.updateOne(postQuery,updatedPost);

            res.send({userResult, postResult});
        })
    }
    finally{

    }
}

run().catch(error=>console.log(error));

app.get('/', (req,res)=>{
    res.send('ATG server is running');
})

app.listen(port, ()=>{
    console.log('server is running on port:',port);
})