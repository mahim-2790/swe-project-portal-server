const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongo url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltkb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        //checking connectivity
        await client.connect();
        console.log('connected successfully');

        //database and collection creation and call...
        const database = client.db('swe-project-portal');
        const projectsCollection = database.collection('projects');
        const usersCollection = database.collection('users');
        const teachersCollection = database.collection('teachers');
        const studentsCollection = database.collection('students');

        //registering user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        //registering teacher
        app.post('/teachers', async (req, res) => {
            const newTeacher = req.body;
            const result = await teachersCollection.insertOne(newTeacher);
            res.json(result);
        });


        //registering students
        app.post('/students', async (req, res) => {
            const newStudents = req.body;
            const result = await studentsCollection.insertOne(newStudents);
            res.json(result);
        });

        //searching project for specific student with student id
        app.get('/projects/:studentId', async (req, res) => {
            const studentId = req.params.studentId;
            const query = { student_id: studentId };
            const result = await projectsCollection.find(query).toArray();
            res.json(result);
        });

        //searching for user in user collection with email 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.json(user);
        });

        //creating project
        app.post('/projects', async (req, res) => {
            const newProject = req.body;
            console.log("project", newProject);
            const result = await projectsCollection.insertOne(newProject);
            console.log(result);
            res.json(result);
        });

        //collecting all project to an array
        app.get('/projects', async (req, res) => {
            const result = await projectsCollection.find().toArray();
            console.log(result);
            res.json(result);
        });


        //delete a project with project id
        app.delete('/projects/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await projectsCollection.deleteOne(query);
            console.log(result);

            res.json(result);
        });

        //searching a project with project id
        app.get('/project/:projectId', async (req, res) => {
            const projectId = req.params.projectId;
            const query = { _id: ObjectId(projectId) };
            const result = await projectsCollection.findOne(query);
            res.json(result);
        });

        //updating one project
        app.put('/updateProject/:id', async (req, res) => {
            const id = req.params.id;
            const project = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: project };
            const result = await projectsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //searching for teacher with teacher id
        app.get('/teachers/:teacherId', async (req, res) => {
            const teacherId = req.params.teacherId;
            console.log(teacherId);
            const query = { id: teacherId };
            const result = await teachersCollection.findOne(query);
            console.log(result);

            res.json(result);
        });

        //searching for projects with teacher initial
        app.get('/teacher/projects/:teacherInitial', async (req, res) => {
            const teacherInitial = req.params.teacherInitial;
            const query = { teacherInitial: teacherInitial };
            const result = await projectsCollection.find(query).toArray();
            res.json(result);
        });

        //searching student with student id
        app.get('/students/:studentId', async (req, res) => {
            const studentId = req.params.studentId;
            const query = { id: studentId };
            const result = await studentsCollection.findOne(query);
            res.json(result);
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