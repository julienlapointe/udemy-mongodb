// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User and BlogPost "collections" / "classes" / "models" to be tested
const User = require("../src/user.js");
const BlogPost = require("../src/blogPost.js");

// test suite for Post subdocuments
describe("Middlware", () => {

	// note: lowercase for "joe" and "blogPost" because these are instances of the uppercase "User" and "BlogPost" classes above
	let joe, blogPost;

	beforeEach((done) => {

		// create a user and blog post for testing purposes
		joe = new User({name: "Joe"});
		blogPost = new BlogPost({title: "My *Awesome* Blog Post Title", content: "My blog post content is *awesome*."});

		// create associations between each collection / document
		// the user "joe" authored the "blogPost" above
		// note: the "blogPosts" (pluralized with an S) property of the user "joe" refers to the array of blog post IDs called "blogPosts" in the UserSchema
		// Mongoose recognizes that we added the "blogPost" object / document to the "joe" object / document and will automatically store only the ID (not the entire object / document) of "blogPost" in "joe"s "blogPosts" property (an array)
		// this is a "has many" relationship (ex. "joe" can have many "blogPost"s)
		joe.blogPosts.push(blogPost);

		// save the user and blog post (along with their association) to MongoDB
		// but we can't chain on the .then(() => { done(); }) to one of these .save()s below because we don't know which operation will complete last...
		// joe.save();
		// blogPost.save();

		// ES6 Promises
		// .all() method accepts an array of Promises and combines them into a single Promise :)
		// each .save() above returns a Promise
		Promise.all([joe.save(), blogPost.save()])
		// are these 2 lines equivalent?
		// .then(() => { done(); })
		.then(() => done() )
	});

	// to run *only* this individual test, use it.only()
	// it.only("Accesses the blog post associated with a user", (done) => {
	it("'Pre' hook to remove user's blog posts before removing the user", (done) => {
		// .remove() is asynchronous so much use .then()
		joe.remove()
		// .count() is asynchronous so much use .then()
		.then(() => BlogPost.count())
			// "count" represents the # of blog posts in MongoDB
			.then((count) => {
				assert(count ===0);
				done();
			});
	});

});