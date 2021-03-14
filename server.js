import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';

// app config
const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(express.json());
app.use(cors());

// DB config

// API routes
app.get('/', (req, res) => res.status(200).send('Hello world'));


// listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));


