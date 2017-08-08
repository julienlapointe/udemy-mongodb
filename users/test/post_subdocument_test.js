// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User "collection" / "class" / "model" to be tested
const User = require("../src/user.js");

// test suite for Post subdocuments
describe("Subdocuments", () => {
	it("Creates and saves a subdocument", (done) => {
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
					assert(user.posts[0].url === "https://www.udemy.com/");
					done();
				});
			});
	});

	it("Adds subdocuments (posts) to an existing document (user)", (done) => {
		// step 1: create new user (a new instance of User) with a nested Post
		const joe = new User({ 
			name: "Joe"
			// , posts: []
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
				// user.set("posts", { url: "https://www.udemy.com/"});
				user.posts.push({url: "https://www.udemy.com/"});
				user.save()
				// is the "return" actually needed? I don't think so...
				// return user.save()
				.then(() => {
					// find the user document named "Joe"
					User.findOne({ name: "Joe" })
					.then((user) => {
						assert(user.posts[0].url === "https://www.udemy.com/");
						done();
					});
				});
			});
		});
	});

	it("Removes an existing subdocument (post)", (done) => {
		// step 1: create new user (a new instance of User) with a nested Post
		const joe = new User({ 
			name: "Joe", 
			posts: [{url: "https://www.udemy.com/"}]
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
				// remove the post
				// const post = user.posts[0];
				// post.remove();
				// NOTE: .remove() does *NOT* save the document... must call .save() after it...
				user.posts[0].remove();
				user.save()
				.then(() => {
					// find the user document named "Joe"
					User.findOne({ name: "Joe" })
					.then((user) => {
						assert(user.posts.length === 0);
						done();
					});
				});
			});
		});
	});

});