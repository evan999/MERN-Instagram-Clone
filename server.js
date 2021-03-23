const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Pusher = require('pusher');
const dbModel = require('./dbModel.js');

const app = express();
const port = process.env.PORT || 8080;

const pusher = new Pusher({
	appId: "1175440",
	key: "840558c36b0f945357dc",
	secret: "67e4483f5d974e0bf91c",
	cluster: "us2",
	useTLS: true
});


app.use(express.json());
app.use(cors());


const connection_url = 'mongodb+srv://master:pcStTUglw1ZkokCU@cluster0.r5wbt.mongodb.net/instaDB?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
	console.log('DB Connected');

	const changeStream = mongoose.connection.collection('posts').watch();

	changeStream.on('change', (change) => {
		console.log("Change triggered on pusher..., Change...");
		console.log(change);
		console.log("End of change");

		if (change.operationType === 'insert') {
			console.log('Triggering Pusher ***IMG UPLOAD***');

			const postDetails = change.fullDocument;
			pusher.trigger('posts', 'inserted', {
				user: postDetails.user,
				caption: postDetails.caption,
				image: postDetails.image
			});
		}
		else {
			console.log('Unknown trigger from Pusher');
		}
	});
});


app.get('/', (req, res) => res.status(200).send('Hello world'));

app.post('/upload', (req, res) => {
	const body = req.body;

	dbModel.create(body, (err, data) => {
		if (err) {
			res.status(500).send(err);
		}
		else {
			res.status(201).send(data);
		}
	});
});

app.get('/sync', (req, res) => {
	dbModel.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		}
		else {
			res.status(200).send(data);
		}
	});
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));


