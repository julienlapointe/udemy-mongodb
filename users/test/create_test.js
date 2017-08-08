// this file tests whether we can create a new user object and save it to the User collection in our MongoDB database
// note: all test filenames end in "_test.js"

// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User "collection" / "class" / "model" to be tested
const User = require("../src/user.js");

// Mocha's describe() function
// param #1: string describing the "test suite"
// param #2: function containing the "individual tests"
describe("Creating records", () => {
	// Mocha's it() function
	// param #1: string describing this "individual test"
	// param #2: function containing the assertion
	// "assertion" = we expect the tested code to return value "x"
	// passing in the "done" parameter tells Mocha to wait until the done() callback function is invoked before proceeding to the next individual test / test suite
	it("Saves a user", (done) => {
		// Mocha doesn't include a library to help build assertions
		// must use the "assert" module / library
		// assert(1 + 1 === 2);
		// step 1: create new user (a new instance of User)
		// the object "joe" is currently just sitting in memory, so we must save it to MongoDB in order to "persist" this data
		const joe = new User({ name: "Joe" });
		// step 2: save new user to MongoDB
		// Mongoose adds lots of properties / methods to newly created "records" / "documents" (ex. the .save() method below)
		// use Promises to tell Mocha to wait for .save() to complete / "resolve()" before proceeding with tests
		// .save() returns a Promise
			// resolve() = object "joe" was successfully added / saved to MongoDB
			// reject() = object "joe" was *not* successfully added / saved to MongoDB
		// Promises allow your code to run sequentially / in a series / procedurally (similar to callback functions, but cleaner syntax with .then())
		// note: every Mongoose method that interacts with the database returns a Promise that is either:
			// - "resolved" if the operation (ex. dropping all documents) was successful 
			// - "rejected" if the operation failed
		// .save() is equivalent to INSERT in SQL
		joe.save()
		// .then() is invoked when the Promise "resolves"
		.then(() => {
			// step 3: test that new user was successfully added to MongoDB
			// Mongoose adds .isNew property to each object
				// .isNew === true when object has *not* yet been saved to MongoDB
				// .isNew === false when object has been successfully saved to MongoDB
			// assert(!joe.isNew); asks Mocha to test: has "joe" been successfully saved to MongoDB?
			assert(!joe.isNew);
			// tell Mocha that this individual test (it()) is complete
			// Mocha can proceed to the next test
			done();
		});
	});

});