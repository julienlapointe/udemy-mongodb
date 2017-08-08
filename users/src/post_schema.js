// this file defines the Schema for a Post sub-document (belongs to User)

// step 1: import dependencies 
// add the NPM "Mongoose" module
const mongoose = require('mongoose');

// step 2: get the Mongoose property "Schema"
// store the Mongoose property "Schema" 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

// step 3: define the Schema for the collection
// a "schema" specifies the properties / "fields" (= "columns") that each document (= "record") in this collection (= "table") will have, along with the data types of each property / field (= "column")
const PostSchema = new Schema(
	{
		url: String,
		createdAt: Date
	}, 
	{ 
		timestamps: { createdAt: 'created_at' } 
	}
);

// SKIP THIS STEP BECAUSE 'POST' DOES NOT NEED A MODEL AS IT IS A SUBDOCUMENT OF 'USER'
// step 4: create the collection
// const Post = mongoose.model("post", PostSchema);

// step 5: export the Schema
// make the Post Schema available to other files
module.exports = PostSchema;