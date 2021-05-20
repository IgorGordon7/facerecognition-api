import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Be696102be',
        database: 'facerecognition'
    }
})


const app = express()
app.use(express.json())
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password:'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password:'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login:[
        {
            id:'1231',
            hash:'',
            email:'john@gmail.comn'
        }
    ]
}

app.get('/',(req,res) =>{
    res.send(database.users)
})

app.get('/profile/:id',(req,res) =>{
    const {id} = req.params
   db.select('*').from('users').where({id:id}).then(user =>{
       if(user.length){
           res.json(user[0])
       }else{
           res.status(400).json('User not found')
       }
   })
       .catch(err => res.status(400).json("Error getting user"))
})

app.post('/signin',(req,res) =>{
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    }else{
        res.status(400).json('Error Login In')
    }
    res.json('Signing')
})

app.post('/register',(req,res) =>{
    const {name,email,password} = req.body
    bcrypt.hash(password,null,null,function (err,hash){

    })
    db('users')
        .returning('*')
        .insert({
        name:name,
        email:email,
        joined: new Date()
    }).then(user =>{
        res.json(user[0])
    })
        .catch(err =>{
            res.status(400).json('Unable to Register')
        })
})

app.put('/image',(req,res) =>{
    const {id} = req.body
   db('users').where('id','=',id).increment('entries',1)
       .returning('entries')
       .then(entries =>{
            res.json(entries[0])
       })
       .catch(err => {
           res.status(400).json('Unable to get entries')
       })
})

app.listen(3000)