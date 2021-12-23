const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const {
    MongoClient
} = require('mongodb');
require('dotenv').config({
    path: './.env'
});

const db = require('db')
db.connect({
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    url: process.env.DB_FINAL_URL
})

const app = express();
const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.FINAL_URL);
const dbName = "eindopdracht";

const result = dotenv.config()

if (result.error) {
    throw result.error
}

console.log(result.parsed)

// app.use(bodyParser.urlencoded({extended = true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Get all favorite recipes: /recipes' + 'Post challenge: /saveChallenge ');

})

app.get('/recipes', async (req, res) => {
    try {
        await client.connect();

        const colli = client.db('eindopdracht').collection('recipes');
        const findRecipes = await colli.find({}).toArray();

        res.status(200).send(findRecipes);
    } catch (error) {
        console.log('get', error);
        res.status(500).send({
            error: 'Something went wrong. Try again',
            value: error
        });
    } finally {
        await client.close();
    }

})

// app.get('/recipe', async (req, res) =>{
//     try {
//         await client.connect();

//         const colli = client.db('eindopdracht').collection('recipes');

//         const query = {
//             rid: req.query.id
//         };

//         const options = {
//             projection: {
//                 _id: 0
//             }
//         }

//         const recipe = await colli.find({
//             query, options
//         });

//         if(recipe){
//             res.status(200).send(recipe);
//             return;
//         }else{
//             res.status(400).send('Recipe could not be found with id= ' + req.query.id);
//         }

//        } catch (error) {
//         console.log('get',error);
//         res.status(500).send({
//             error: 'Something went wrong. Try again',
//             value: error
//         });
//     }finally {
//        await client.close();
//    }
// })

app.post('/saveRecipe', async (req, res) => {
    console.log(req.body)

    if (!req.body.rid || !req.body.title || !req.body.ingredients || !req.body.summary || !req.body.information) {
        res.status(400).send('Bad request: missing id, title, ingredients, summary or information');
        return;
    }

    try {
        await client.connect();

        const colli = client.db('eindopdracht').collection('recipes');

        const recipe = await colli.findOne({
            rid: req.body.rid
        });

        if (recipe) {
            res.status(400).send('Bad request: boardgame already exists with rid ' + req.body.rid);
            return;
        }

        let newRecipe = {
            rid: req.body.rid,
            title: req.body.title,
            ingredients: req.body.ingredients,
            summary: req.body.summary,
            information: req.body.information
        }

        let insertResultRecipe = await colli.insertOne(newRecipe);

        res.status(201).send(newRecipe)
        return;

    } catch (error) {
        console.log('post', error);
        res.status(500).send({
            error: 'Something went wrong. Try again',
            value: error
        })
    } finally {
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