const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./userschema.js');
const { Note } = require('./noteschema.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

// Connect to MongoDB
async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://nithanantoj2022cse:anto2022cse@cluster0.ua76ums.mongodb.net/Notes_app?retryWrites=true&w=majority&appName=Cluster0');
        console.log('DB connection established :)');
        app.listen(port, function () {
            console.log(`Listening on port ${port}...`);
        });
    } catch (error) {
        console.error('Couldn\'t establish the connection', error);
    }
}
connectToDb();



// Routes for authentication
app.post('/signup', async function (request, response) {
    try{
        await User.create({
            "username" : request.body.username,
            "password" : request.body.password,
        })
        response.status(200).json({
            "status" : "success",
            "message" : "new entry created"
        })
    }
    catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
});

app.post('/login', async function (request, response) {
    try {
        const username = request.body.username;
        const password = request.body.password;
        const user = await User.find({ 
            username: username,
            password: password
        })
        if (!user) {
            return response.status(401).json({
                status: 'failure',
                message: 'Invalid username or password',
            });
        }

        response.status(200).json({
            status: 'success',
            message: 'Login successful',
            userId: user._id,
        });
    } catch (error) {
        response.status(500).json({
            status: 'failure',
            message: 'Failed to login',
            error: error.message,
        });
    }
});

// // Routes for notes
app.post('/add-note', async function (request, response) {
    try {
        const title = request.body.title;
        const content = request.body.content;
        const userId= request.body.userId;
        const user = await User.findById({
            _id : userId });
        if (!user) {
            return response.status(404).json({
                status: 'failure',
                message: 'User not found',
            });
        }

        const newNote = await Note.create({
            title,
            content,
            user: userId,
        });

        response.status(201).json({
            status: 'success',
            message: 'New note created',
            data: newNote,
        });
    } catch (error) {
        response.status(500).json({
            status: 'failure',
            message: 'Note not created',
            error: error.message,
        });
    }
});

app.get('/get-notes/:userId', async function (request, response) {
    try {
        const userId = request.params.userId;
        const user = await User.findById({
            _id : userId});
        if (!user) {
            return response.status(404).json({
                status: 'failure',
                message: 'User not found',
            });
        }

        const notes = await Note.find({ user: userId });
        response.status(200).json(notes);
    } catch (error) {
        response.status(500).json({
            status: 'failure',
            message: 'Failed to fetch notes',
            error: error.message,
        });
    }
});

app.delete('/delete-note/:noteId', async function (request, response) {
    try {
        const noteId = request.params.noteId;
        const note = await Note.findById(noteId);
        if (!note) {
            return response.status(404).json({
                status: 'failure',
                message: 'Note not found',
            });
        }
        await Note.findByIdAndDelete(request.params.noteId);
        response.status(200).json({
            status: 'success',
            message: 'Note deleted successfully',
        });
    } catch (error) {
        response.status(500).json({
            status: 'failure',
            message: 'Failed to delete note',
            error: error.message,
        });
    }
});

app.patch('/update-note/:noteId', async function (request, response) {
    try {
        const noteId= request.params.noteId;
        const title = request.body.title;
        const content = request.body.content;
        const note = await Note.findById(noteId);
        if (!note) {
            return response.status(404).json({
                status: 'failure',
                message: 'Note not found',
            });
        }

        note.title = title || note.title;
        note.content = content || note.content;
    

        await note.save();

        response.status(200).json({
            status: 'success',
            message: 'Note updated successfully',
            data: note,
        });
    } catch (error) {
        response.status(500).json({
            status: 'failure',
            message: 'Failed to update note',
            error: error.message,
        });
    }
});


