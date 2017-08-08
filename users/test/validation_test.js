// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User "collection" / "class" / "model" to be tested
const User = require("../src/user.js");

// Mocha's describe() function
// param #1: string describing the "test suite"
// param #2: function containing the "individual tests"
describe("Updating user records in database", () => {
	// Mocha's it() function
	// param #1: string describing this "individual test"
	// param #2: function containing the assertion
	// "assertion" = we expect the tested code to return value "x"
	// passing in the "done" parameter tells Mocha to wait until the done() callback function is invoked before proceeding to the next individual test / test suite
	// test that the error message displays when a user omits their name
	it("Validates the user's name exists", () => {
		// Mocha doesn't include a library to help build assertions
		// must use the "assert" module / library
		// assert(1 + 1 === 2);
		// create new user (a new instance of User) with no name defined
		const user = new User({ name: undefined });
		// .validateSync() returns an object containing any validation errors
		// synchronous
		const validationResult = user.validateSync();
		// asynchronous
		// use .validate() asynchronously to check values inputted by user against values in MongoDB (ex. does this name, link, etc. already exist in MongoDB)  
		// user.validate((validationResult) => {
		// });
		// console.log(validationResult);
		// the two lines below are equivalent
		// const message = validationResult.errors.name.message;
		// ES6 destructuring produces the same result as the line above
		const {message} = validationResult.errors.name;
		assert(message === "Name is required.");
	});

	// test that the error message displays when a user's name is 0 or 1 characters long
	it("Validates the user's name is longer than 1 character", () => {
		// create new user (a new instance of User) with no name defined
		const user = new User({ name: "X" });
		// .validateSync() returns an object containing any validation errors
		// synchronous
		const validationResult = user.validateSync();
		const {message} = validationResult.errors.name;
		assert(message === "Name must be longer than 1 character.");
	});

	// test that invalid documents / records cannot be saved to MongoDB
	it("Disallows invalid documents / records from being saved to MongoDB", (done) => {
		// create new user (a new instance of User) with no name defined
		const user = new User({ name: "X" });
		user.save()
			// .then()
			// .save() returns a Promise
			// the Promise should call reject() because the user's name is invalid
			// use .catch to handle the rejected Promise from .save()
			.catch((validationResult) => {
				const {message} = validationResult.errors.name;
				assert(message === "Name must be longer than 1 character.");
				done();
			});
	});

});