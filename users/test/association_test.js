// add the NodeJS "assert" module to build assertions for unit testing
const assert = require("assert");
// add the User, BlogPost and Comment "collections" / "classes" / "models" to be tested
const User = require("../src/user.js");
const BlogPost = require("../src/blogPost.js");
const Comment = require("../src/comment.js");

// test suite for Post subdocuments
describe("Collection associations", () => {

	// note: lowercase for "joe", "blogPost", and "comment" because these are instances of the uppercase "User", "BlogPost", and "Comment" classes above
	let joe, blogPost, comment;

	beforeEach((done) => {

		// create a user, blog post, and comment for testing purposes
		joe = new User({name: "Joe"});
		blogPost = new BlogPost({title: "My *Awesome* Blog Post Title", content: "My blog post content is *awesome*."});
		comment = new Comment({content: "Wow! That blog post was totally *awesome*."});

		// create associations between each collection / document
		// the user "joe" authored the "blogPost" above
		// note: the "blogPosts" (pluralized with an S) property of the user "joe" refers to the array of blog post IDs called "blogPosts" in the UserSchema
		// Mongoose recognizes that we added the "blogPost" object / document to the "joe" object / document and will automatically store only the ID (not the entire object / document) of "blogPost" in "joe"s "blogPosts" property (an array)
		// this is a "has many" relationship (ex. "joe" can have many "blogPost"s)
		joe.blogPosts.push(blogPost);
		// this is a "has many" relationship (ex. "blogPost" can have many "comment"s)
		blogPost.comments.push(comment);
		// this is a "has one" relationship (ex. "comment" can only have 1 "user" as its author)
		comment.user = joe;

		// save the user, blog post, and comment (along with their associations) to MongoDB
		// but we can't chain on the .then(() => { done(); }) to one of these .save()s below because we don't know which operation will complete last...
		// joe.save();
		// blogPost.save();
		// comment.save();

		// ES6 Promises
		// .all() method accepts an array of Promises and combines them into a single Promise :)
		// each .save() above returns a Promise
		Promise.all([joe.save(), blogPost.save(), comment.save()])
		// are these 2 lines equivalent?
		// .then(() => { done(); })
		.then(() => done() )
	});

	// to run *only* this individual test, use it.only()
	// it.only("Accesses the blog post associated with a user", (done) => {
	it("Accesses the blog post associated with a user", (done) => {
		User.findOne({name: "Joe"})
		// .populate() is a query "modifer" that returns documents associated to the document "Joe" as *referenced* in the UserSchema ("Joe" is a document in the "User" collection) 
		.populate("blogPosts")
		.then((user) => {
			// console.log(user);
			/* output from console.log(user);
			{ 
				_id: 59895e1c8bdf1d4bace2e613,
				title: 'My *Awesome* Blog Post Title',
				content: 'My blog post content is *awesome*.',
				__v: 0,
				comments: [Array]
			} */
			assert(user.blogPosts[0].title === "My *Awesome* Blog Post Title");
			done();
		});
	});

	it("Accesses a full association / relation graph", (done) => {
		User.findOne({name: "Joe"})
		// .populate() is a query "modifer" that returns documents associated to the document "Joe" as *referenced* in the UserSchema ("Joe" is a document in the "User" collection) 
		// .populate() can accept an object with the "path" key representing the field / property / type that references an associated documents (usually by their ID)
		// nesting "populate" keys / modifiers allows you to load / access / return deeply nested associations (ex. return user "Joe" + all "blogPosts" written by "Joe" + all "comments" for each "blogPost" + the "user" who authored each "comment")
		// use the "model" key to specify which Mongoose model to use at each level of this .populate() "tree"
		// .populate("blogPosts")
		.populate({
			path: "blogPosts",
			populate: {
				path: "comments",
				model: "Comment",
				populate: {
					path: "user",
					model: "User"
				}
			}
		})
		.then((user) => {
			// console.log(user);
			// console.log(user.blogPosts[0]);
			console.log(user.blogPosts[0].comments[0]);
			/* output from console.log(user);
			{ 
				_id: 59895e1c8bdf1d4bace2e613,
				title: 'My *Awesome* Blog Post Title',
				content: 'My blog post content is *awesome*.',
				__v: 0,
				comments: [Array]
			} */
			assert(user.name === "Joe");
			assert(user.blogPosts[0].title === "My *Awesome* Blog Post Title");
			assert(user.blogPosts[0].comments[0].content === "Wow! That blog post was totally *awesome*.");
			assert(user.blogPosts[0].comments[0].user.name === "Joe");
			done();
		});
	});

});