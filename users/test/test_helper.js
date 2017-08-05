// this file sets up / configures the testing environment
const mongoose = require('mongoose');

// initiate connection between Mongoose and MongoDB
// replace "localhost" with "IPaddress:port" in staging / production environments
// "users_test" = database name
// you don't need to create the database ahead of time (you can simply name the database and add a record to it, then Mongoose/MongoDB will automatically create the database)
mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
	// event listener
	// listen for "open" event to happen once (if "open" occurs multiple times, only fire the callback function on the 1st occurance)
	// if the Mongoose-MongoDB connection is opened, then...
	.once('open', () => console.log("Good to go!"))
	// event listener
	// listen for the "error" event
	// otherwise, if Mongoose-MongoDB connection fails, then...
	.on('error', (error) => {
		console.warn('Warning', error);
	});
	// semicolon above is for closing the long line of "mongoose.connection" with the .on() and .once() methods chained on

// add a Mocha "hook"
// the beforeEach() "hook" runs before each test suite (describe() block) 
// empty the MongoDB test database before running each test suite
// every Mocha "hook" gets called with a done() callback function
beforeEach((done) => {
	// Notes:
	// must tell Mocha tests to wait for the .drop() operation to finish before running tests
	// database operations are not instantaneous (they are *fast*, but still take some time), therefore these operations are done asynchronously
	// "out-of-the-box" Mocha has no understanding of "asynchronous" / waiting for other tasks (ex. dropping the database) to complete - Mocha just wants to run all its tests as fast as possible
	// Mocha's done() callback function is invoked when the database operation (.drop() in this case) is *done* - this tells Mocha that it can proceed running its tests
	mongoose.connection.collections.users.drop(() => {
		// place anonymous function inside .drop() - this is a callback function that gets invoked when the .drop() operation is complete
		// use Mocha's done() callback function to tell Mocha that we are done this operation (an operation that is necessary for testing) and Mocha can now proceed running its tests 
		done();
	});
});