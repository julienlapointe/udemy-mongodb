// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User "collection" / "class" / "model" to be tested
const User = require("../src/user.js");

// Mocha's describe() function
// param #1: string describing the "test suite"
// param #2: function containing the "individual tests"
describe("Deleting a user from database", () => {
	// declare object "joe" up here so that we can access the variable in beforeEach() and it() functions below
	let joe;
	// add a Mocha "hook"
	// the beforeEach() "hook" runs before each test suite (describe() block) 
	// populate the MongoDB database with user(s) named "Joe" for testing purposes
	// every Mocha "hook" gets called with a done() callback function
	beforeEach((done) => {
		// create a new user named "Joe"
		// did not declare the object "joe" with "let" because that would tie its scope to this beforeEach() function (we may want to reference "joe" below in the individual test it())
		// note: Mongoose automatically assigns the variable "joe" an ID at this point (before it is even saved to MongoDB! MongoDB will use the same ID) and this ID is stored in the joe._id property
		joe = new User({name: "Joe"});
		// insert the new user into the database
		joe.save()
			// when this operation is complete (resolve() = .then()), call Mocha's done() callback to tell it to proceed to the next test
			.then(() => done());
	});
	// Mocha's it() function
	// param #1: string describing this "individual test"
	// param #2: function containing the assertion
	// "assertion" = we expect the tested code to return value "x"
	// passing in the "done" parameter tells Mocha to wait until the done() callback function is invoked before proceeding to the next individual test / test suite
	it("Class *instance* remove() to delete a user document / object / record / instance of User class / collection / table", (done) => {
		// delete the user named "Joe"
		// Mongoose adds lots of properties / methods to newly created "records" / "documents" (ex. the .remove() method below)
		// use Promises to tell Mocha to wait for .save() to complete / "resolve()" before proceeding with tests
		// .remove() returns a Promise
			// resolve() = object(s) with criteria "joe" was / were successfully found in MongoDB
			// reject() = object(s) with criteria "joe" was / were *not* found in MongoDB
		// note: every Mongoose method that interacts with the database returns a Promise that is either:
			// - "resolved" if the operation (ex. deleting the user) was successful 
			// - "rejected" if the operation failed
		// .remove() is equivalent to DELETE in SQL
		joe.remove()
		// this .then() only executes when the .remove() operation is complete / has "resolved" (Promises)
		.then(() => {
			User.findOne({ name: "Joe" })
			// this .then() only executes when the .findOne() operation is complete / has "resolved" (Promises)
			// Param: "user" = the user object returned from MongoDB after deleting "joe", then searching for it...
			.then((user) => {
				// Mongoose should return NULL for "user" because "joe" doesn't exist in the database anymore (it was removed / deleted above)
				assert(user === null);
				done();
			})
		});
	});

	it("Class remove() to delete multiple records / documents that match a specific criteria or remove / delete the entire User class / collection / table", (done) => {
		// removes / deletes all records / documents in the User class / collection that match a specific criteria (users named "Joe")
		User.remove({ name: "Joe" })
		// this .then() only executes when the .remove() operation is complete / has "resolved" (Promises)
		.then(() => {
			User.findOne({ name: "Joe" })
			// this .then() only executes when the .findOne() operation is complete / has "resolved" (Promises)
			// Param: "user" = the user object returned from MongoDB after deleting "joe", then searching for it...
			.then((user) => {
				// Mongoose should return NULL for "user" because "joe" doesn't exist in the database anymore (it was removed / deleted above)
				assert(user === null);
				done();
			})
		});
	});

	it("Class method findOneAndRemove() to read and remove / delete a user document / object / record / instance of User class / collection / table", (done) => {
		// removes / deletes all records / documents in the User class / collection that match a specific criteria (users named "Joe")
		User.findOneAndRemove({ name: "Joe" })
		// this .then() only executes when the .remove() operation is complete / has "resolved" (Promises)
		.then(() => {
			User.findOne({ name: "Joe" })
			// this .then() only executes when the .findOne() operation is complete / has "resolved" (Promises)
			// Param: "user" = the user object returned from MongoDB after deleting "joe", then searching for it...
			.then((user) => {
				// Mongoose should return NULL for "user" because "joe" doesn't exist in the database anymore (it was removed / deleted above)
				assert(user === null);
				done();
			})
		});
	});

	// findByIdAndRemove() is a subset of findOneAndRemove() because you can use the ._id as the criteria for findOneAndRemove()
	it("Class method findByIdAndRemove() to read and remove / delete a user document / object / record / instance of User class / collection / table", (done) => {
		// removes / deletes all records / documents in the User class / collection that match a specific criteria (users named "Joe")
		// ".toString() not needed here because this is not a comparison"...
		User.findByIdAndRemove(joe._id)
		// this .then() only executes when the .remove() operation is complete / has "resolved" (Promises)
		.then(() => {
			User.findOne({ name: "Joe" })
			// this .then() only executes when the .findOne() operation is complete / has "resolved" (Promises)
			// Param: "user" = the user object returned from MongoDB after deleting "joe", then searching for it...
			.then((user) => {
				// Mongoose should return NULL for "user" because "joe" doesn't exist in the database anymore (it was removed / deleted above)
				assert(user === null);
				done();
			})
		});
	});
});