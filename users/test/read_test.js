// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User "collection" / "class" / "model" to be tested
const User = require("../src/user.js");

// Mocha's describe() function
// param #1: string describing the "test suite"
// param #2: function containing the "individual tests"
describe("Reading users from database", () => {
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
	it("Finds all users with the name 'Joe'", (done) => {
		// find all users with the name "Joe"
		// Mongoose adds lots of properties / methods to newly created "records" / "documents" (ex. the .find() method below)
		// use Promises to tell Mocha to wait for .save() to complete / "resolve()" before proceeding with tests
		// .find() returns a Promise
			// resolve() = object(s) with criteria "joe" was / were successfully found in MongoDB
			// reject() = object(s) with criteria "joe" was / were *not* found in MongoDB
		// note: every Mongoose method that interacts with the database returns a Promise that is either:
			// - "resolved" if the operation (ex. finding / reading the user) was successful 
			// - "rejected" if the operation failed
		// .find() is equivalent to SELECT in SQL
		User.find({ name: "Joe" })
		// .then() is invoked when the Promise "resolves"
		// param: "users" represents all the users that were *found* (matched the search criteria) in the database
		.then((users) => {
			// we expect 1 user to be found with the name "Joe"
			// console.log(users);
			// console.log(users[0]._id);
			// console.log(joe._id);
			// test if the first user returned in the "users" array has the same ID as the ID assigned to the variable "joe" created using the .save() in the beforeEach() function
			// IMPORTANT: MongoDB saves IDs in this format: ObjectId("12345667890")... must use .toString() method for === to pass / be true
			assert(users[0]._id.toString() === joe._id.toString());
			// tell Mocha that this individual test (it()) is complete
			// Mocha can proceed to the next test
			done();
		});
	});

	it("Find a user with a particular ID", (done) => {
		// ".toString() not needed here because this is not a comparison"...
		User.findOne({ _id: joe._id })
		// a single record / user is returned
		.then((user) => {
			assert(user.name === "Joe");
			done();
		});
	});
});