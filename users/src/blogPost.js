// this file defines the Schema for a BlogPost document in MongoDB and creates a Model for it

// step 1: import dependencies 
// add the NPM "Mongoose" module
const mongoose = require('mongoose');

// step 2: get the Mongoose property "Schema"
// store the Mongoose property "Schema" 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

// step 3: define the Schema for the collection
// a "schema" specifies the properties / "fields" (= "columns") that each document (= "record") in this collection (= "table") will have, along with the data types of each property / field (= "column")
const BlogPostSchema = new Schema({
	title: String,
	content: String,
	// use an array [] to tell MongoDB that we expect to have many documents / items associated with this type / property / field (each "blog post" may have many "comments")
	// as opposed to nesting / embedding a subdocument here (ex. "post" is nested / embedded into "user"), we are defining a reference to related documents (comments) in the "Comment" collection
	// the definition of the "comments" type / property / field is somewhat similar to: const User = mongoose.model("user", UserSchema); from user.js... where param #1: name of collection (analogous to ref: "Comments" below, which references the "Comments" collection) and param #2: UserSchema defining the structure / type of data to be stored (analogous to type: Schema.Types.ObjectId below, which indicates that an ObjectId / document ID is the data type to be stored)
	comments: [{
		// states that this array will be populated with ObjectIds from a Schema (the CommentSchema)
		type: Schema.Types.ObjectId,
		// references the "Comments" collection
		ref: "Comment"
	}] 
});

// step 4: create the collection
// create the BlogPost "collection" / "class" / "model"
// tell Mongoose to create a MongoDB collection (= "table") called "blog post"
// param #1: name of collection (used by other Schemas to reference this collection)
// param #2: BlogPostSchema defining the structure / type of data to be stored 
const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
// note: every Mongoose method that interacts with the database returns a Promise that is either:
	// - "resolved" if the operation (ex. dropping all documents) was successful 
	// - "rejected" if the operation failed

// step 5: export the collection
// make the BlogPost "collection" / "class" / "model" available to other files
module.exports = BlogPost;