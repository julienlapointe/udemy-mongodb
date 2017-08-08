// this file defines the Schema for a comment document in MongoDB and creates a Model for it

// step 1: import dependencies 
// add the NPM "Mongoose" module
const mongoose = require('mongoose');

// step 2: get the Mongoose property "Schema"
// store the Mongoose property "Schema" 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

// step 3: define the Schema for the collection
// a "schema" specifies the properties / "fields" (= "columns") that each document (= "record") in this collection (= "table") will have, along with the data types of each property / field (= "column")
const commentSchema = new Schema({
	// every "comment" should have a "name" and "postCount" properties / fields (= "columns")
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
	// tell comment document that it should contain a subdocument called "Post" that follows the Post Schema
	posts: [PostSchema],
	likes: Number
});

// step 4: create the collection
// create the comment "collection" / "class" / "model"
// tell Mongoose to create a MongoDB collection (= "table") called "comment"
// param #1: name of collection
// param #2: commentSchema defining the structure / type of data to be stored 
const comment = mongoose.model("comment", commentSchema);
// note: every Mongoose method that interacts with the database returns a Promise that is either:
	// - "resolved" if the operation (ex. dropping all documents) was successful 
	// - "rejected" if the operation failed

// step 5: export the collection
// make the comment "collection" / "class" / "model" available to other files
module.exports = comment;