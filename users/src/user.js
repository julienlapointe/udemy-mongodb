// this file defines the Schema for a User document in MongoDB and creates a Model for it

// step 1: import dependencies 
// add the NPM "Mongoose" module
const mongoose = require('mongoose');

// step 1.5: import the PostSchema ('Post' is a subdocument of 'User')
const PostSchema = require("./post_schema.js");

// step 2: get the Mongoose property "Schema"
// store the Mongoose property "Schema" 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

// step 3: define the Schema for the collection
// a "schema" specifies the properties / "fields" (= "columns") that each document (= "record") in this collection (= "table") will have, along with the data types of each property / field (= "column")
const UserSchema = new Schema({
	// every user should have a "name" and "postCount" properties / fields (= "columns")
	// note: these types are not enforced by Mongoose (ex. a string can be saved in the "postCount" property / field / column) so must add separate data validation before sending data to MongoDB
	// name: String,
	// specify that the "name" field is required (set to true) and provide the error message that can be displayed to the user if they do not provide a name
	name: {
		type: String,
		validate: {
			// ensure the user's name is longer than 1 character
			validator: (name) => name.length > 1,
			// error message to display to user when validator returns FALSE
			message: "Name must be longer than 1 character."
		},
		required: [true, "Name is required."]
	},
	// postCount is now a "virtual type / property" (not stored in MongoDB and instead calculated by Mongoose on web server on-demand / when needed) so postCount must be removed from the Schema
	// postCount: Number,
	// tell User document that it should contain a subdocument called "Post" that follows the Post Schema
	// use an array [] to tell MongoDB that we expect to have many documents / items associated with this type / property / field
	// note the "posts" subdocument was kept for future reference (use it as a template), but the schema design was refactored to create a separate collection called "BlogPost"
	posts: [PostSchema],
	likes: Number,
	// use an array [] to tell MongoDB that we expect to have many documents / items associated with this type / property / field (each "user" can be the author of many "blogPosts")
	blogPosts: [{
		// states that this array will be populated with ObjectIds from a Schema (the BlogPostSchema)
		type: Schema.Types.ObjectId,
		// references the "BlogPost" collection
		ref: "BlogPost"
	}] 
});

// step 3.5: add "virtual type / property" for postCount
// "virtual types / properties" are declared separately *on* UserSchema, but *not inside* the UserSchema declaration above
// note: must use anonymous function() {} syntax in order for "this" (used below) to reference the current instance of User (using fat arrow () => {} syntax, "this" would reference this file's global scope) 
UserSchema.virtual('postCount').get(function() {
	// from "users" directory (root), run "node" to enter the NodeJS shell, then run the commands: (1) const User = require("./src/user"); (2) joe = new User({}); (3) joe.postCount
	// "this" returns the instance of User that we are currently working on with all the properties / fields defined in UserSchema above
	return this.posts.length;
});

// step 4: create the collection
// create the User "collection" / "class" / "model"
// tell Mongoose to create a MongoDB collection (= "table") called "User"
// param #1: name of collection (used by other Schemas to reference this collection)
// param #2: UserSchema defining the structure / type of data to be stored 
const User = mongoose.model("User", UserSchema);
// note: every Mongoose method that interacts with the database returns a Promise that is either:
	// - "resolved" if the operation (ex. dropping all documents) was successful 
	// - "rejected" if the operation failed

// step 5: export the collection
// make the User "collection" / "class" / "model" available to other files
module.exports = User;