// this file sets up / configures the testing environment
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
	// initiate connection between Mongoose and MongoDB
	// replace "localhost" with "IPaddress:port" in staging / production environments
	// "users_test" = database name
	// you don't need to create the database ahead of time (you can simply name the database and add a record to it, then Mongoose/MongoDB will automatically create the database)
	mongoose.connect('mongodb://localhost/users_test');
	mongoose.connection
		// event listener
		// listen for "open" event to happen once (if "open" occurs multiple times, only fire the callback function on the 1st occurance)
		// if the Mongoose-MongoDB connection is opened, then...
		.once('open', () => { done(); })
		// event listener
		// listen for the "error" event
		// otherwise, if Mongoose-MongoDB connection fails, then...
		.on('error', (error) => {
			console.warn('Warning', error);
		});
});

beforeEach((done) => {
	// create new collections in MongoDB using Mongoose
	const { users, comments, blogposts } = mongoose.connection.collections;
	users.drop(() => {
		comments.drop(() => {
			blogposts.drop(() => {
				done();
			});
		});
	});
});
