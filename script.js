const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const {MongoClient} = require ('mongodb');
require('dotenv').config();
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;


const client = new MongoClient(process.env.FINAL_URL);
const dbName = "eindopdracht";


// app.use(bodyParser.urlencoded({extended = true}));
app.use(bodyParser.json());
// app.use(cors());

app.get('/', (req, res) => {
    res.send('Get all favorite recipes: /favoriteRecipes');

})

app.get('/favoriteRecipes', async (req, res) => {
    try {
        await client.connect();
        
        const db = client.db(dbName)
        const colli = db.collection('favoriteRecipes');
        const findRecipes = await colli.find({}).toArray();

        res.status(200).send(findRecipes);
       } catch (err) {
        console.log('get',err);
        res.status(500).send({
            err: 'Something went wrong. Try again',
            value: err
        })
    }

    finally {
       await client.close();
   }

})
app.post('/saveRecipe', async (req, res) => {
    console.log(req.body)


    try {
        await client.connect();

        const db = client.db(dbName)
        const colli = db.collection('favoriteRecipes');

        let newFavoriteRecipe = {
            name: req.body.name,
            points: req.body.points,
            course: req.body.course,
            session: req.body.session
        }

        let insertResultRecipe = await colli.insertOne(newFavoriteRecipe);

        res.status(201).send(newFavoriteRecipe)
        return;

    }catch (err) {
        console.log('post',err);
        res.status(500).send({
            err: 'Something went wrong. Try again',
            value: err
        })
    }
    finally{
        await client.close();
    }
})

app.put('/favoriteRecipes/:id', (req, res) => {
    res.send('Update oke');
});
  
app.delete('/favoriteRecipes/:id', (req, res) => {
    res.send('Delete oke');
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})
