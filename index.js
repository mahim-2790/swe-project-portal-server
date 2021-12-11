const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltkb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected successfully');

        const database = client.db('swe-project-portal');
        const projectsCollection = database.collection('projects');
        const usersCollection = database.collection('users');
        const teachersCollection = database.collection('teachers');
        const studentsCollection = database.collection('students');

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log("user", user);
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        app.post('/teachers', async (req, res) => {
            const newTeacher = req.body;
            console.log("teacher", newTeacher);
            const result = await teachersCollection.insertOne(newTeacher);
            console.log(result);
            res.json(result);
        });

        app.post('/students', async (req, res) => {
            const newStudents = req.body;
            console.log("student", newStudents);
            const result = await studentsCollection.insertOne(newStudents);
            console.log(result);
            res.json(result);
        });

        app.get('/projects/:studentId', async (req, res) => {
            const studentId = req.params.studentId;
            console.log('studentid', studentId);
            const query = { student_id: studentId };
            const result = await projectsCollection.find(query).toArray();
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.json(user);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello project portal!');
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
})