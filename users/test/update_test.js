// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User "collection" / "class" / "model" to be tested
const User = require("../src/user.js");

// Mocha's describe() function
// param #1: string describing the "test suite"
// param #2: function containing the "individual tests"
describe("Updating user records in database", () => {
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
		joe = new User({name: "Joe", likes: 0});
		// insert the new user into the database
		joe.save()
			// when this operation is complete (resolve() = .then()), call Mocha's done() callback to tell it to proceed to the next test
			.then(() => done());
	});

	// this function abstracts the code below from each of the individual tests it() below
	// Param: the promise from the .save() operation
	function assertNameEqualsAlex(promise, done) {
		promise
		// this .then() only executes when the .save() operation is complete / has "resolved" (Promises)
		.then(() => {
			// .find({}) returns *all* users
			User.find({})
			// this .then() only executes when the .find() operation is complete / has "resolved" (Promises)
			// Param: "users" = all users in MongoDB
			.then((users) => {
				// there should only be 1 user record in MongoDB (added by the beforeEach() hook above)
				assert(users.length === 1);
				// this single user record should have the name "Alex" (updated from "Joe" above)
				assert(users[0].name === "Alex");
				done();
			})
		});
	}

	// Mocha's it() function
	// param #1: string describing this "individual test"
	// param #2: function containing the assertion
	// "assertion" = we expect the tested code to return value "x"
	// passing in the "done" parameter tells Mocha to wait until the done() callback function is invoked before proceeding to the next individual test / test suite
	it("Class *instance* 'set and save' to update a user document / object / record / instance of User class / collection / table", (done) => {
		// update the user's name from "Joe" to "Alex" 
		// Mongoose adds lots of properties / methods to newly created "records" / "documents" (ex. the .set() and .save() methods below)
		// use Promises to tell Mocha to wait for .save() to complete / "resolve()" before proceeding with tests
		// .save() returns a Promise
			// resolve() = object(s) with criteria "joe" was / were successfully found in MongoDB
			// reject() = object(s) with criteria "joe" was / were *not* found in MongoDB
		// note: every Mongoose method that interacts with the database returns a Promise that is either:
			// - "resolved" if the operation (ex. deleting the user) was successful 
			// - "rejected" if the operation failed
		// .set() + .save() is equivalent to UPDATE in SQL
		// note: .set() only changes the "name" value in *memory* so must .save() to commit change to MongoDB
		// note: it is useful to have .set() so that multiple functions can .set() "fields" for a specific "document" and then .save() will commit all the updated values to MongoDB
		joe.set("name", "Alex");
		// joe.save() is executed and returns a Promise
		// the Promise is then passed into the assertNameEqualsAlex function as a parameter, where assertNameEqualsAlex handles the .then chains and assertions
		assertNameEqualsAlex(joe.save(), done);
	});

	it("Class *instance* 'set and save' to update a user document / object / record / instance of User class / collection / table", (done) => {
		// update the user's name from "Joe" to "Alex" 
		// .update() = .set() + .save()
		// joe.update({ name: "Alex" });
		assertNameEqualsAlex(joe.update({ name: "Alex" }), done);
	});

	it("Class update() to update multiple records / documents that match a specific criteria or update the entire User class / collection / table", (done) => {
		// finds all records / documents in the User class / collection with the name "Joe" and updates / changes the name to "Alex"
		assertNameEqualsAlex(
			// .update() in this case is the same as using the MongoDB update operator / modifier $set (so $set is useless?)
			User.update({name: "Joe"}, {name: "Alex"}),
			done 
		);
	});

	it("Class method findOneAndUpdate() to read and update a user document / object / record / instance of User class / collection / table", (done) => {
		assertNameEqualsAlex(
			User.findOneAndUpdate({name: "Joe"}, {name: "Alex"}),
			done 
		);
	});

	// findByIdAndUpdate() is a subset of findOneAndUpdate() because you can use the ._id as the criteria for findOneAndUpdate()
	it("Class method findByIdAndRemove() to read and remove / delete a user document / object / record / instance of User class / collection / table", (done) => {
		assertNameEqualsAlex(
			User.findByIdAndUpdate(joe._id, {name: "Alex"}),
			done 
		);
	});

	// xit() omits this individual test (Mocha will not run it)
	// xit("Increment 'likes' by 1 for all users named 'Joe'", (done) => {
	it("Increment 'likes' by 1 for all users named 'Joe'", (done) => {
		// use the MongoDB update operator / modifier $inc to increment the likes value by 1 for all users named "Joe"
		// note: increment by a negative value (ex. -1) to decrement ($dec DNE)
		User.update({name: "Joe"}, {$inc: {likes: 10}})
		// this .then() only executes when the .save() operation is complete / has "resolved" (Promises)
		.then(() => {
			// .findOne({}) returns the first user with the name "Joe"
			User.findOne({name: "Joe"})
			// this .then() only executes when the .findOne() operation is complete / has "resolved" (Promises)
			// Param: "user" = represents "the first document according to the natural order which reflects the order of documents on the disk" (https://docs.mongodb.com/v3.4/reference/method/db.collection.findOne/)
			.then((user) => {
				// check that the "likes" value has been incremented by 1 (from 0 -> 1 in this case)
				assert(user.likes === 10);
				done();
			})
		});
	});

});