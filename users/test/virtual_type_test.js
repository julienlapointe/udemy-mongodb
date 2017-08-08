// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User "collection" / "class" / "model" to be tested
const User = require("../src/user.js");

// test suite for Mongoose virtual types / properties /  fields 
describe("Virtual types", () => {
	// note: asynchronous tests need the done() callback function passed in as a parameter
	it("postCount returns correct number of posts", (done) => {
		// step 1: create new user (a new instance of User) with a nested Post
		const joe = new User({ 
			name: "Joe", 
			posts: [{ url: "https://www.udemy.com/"}]
		});
		// step 2: save new user with post to MongoDB
		joe.save()
			// this .then() is invoked when the .save() completes / .save() Promise "resolves"
			.then(() => {
				// find the user document named "Joe"
				User.findOne({ name: "Joe" })
				// this .then() is invoked when the .findOne() completes / .findOne() Promise "resolves"
				// when the .findOne() Promise "resolves", it returns a single document ("user" in this case)
				.then((user) => {
					assert(user.postCount === 1);
					done();
				});
			});
	});

});