// step 1: import dependencies 
// add the NPM "Mongoose" module
const mongoose = require('mongoose');

// step 2: get the Mongoose property "Schema"
// store the Mongoose property "Schema" 
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

// step 3: define the Schema for the collection
// a "schema" specifies the properties / "fields" (= "columns") that each document (= "record") in this collection (= "table") will have, along with the data types of each property / field (= "column")
const UserSchema = new Schema({
	// every user should have a "name" property / field (= "column")
	name: String
});

// step 4: create the collection
// create the User "collection" / "class" / "model"
// tell Mongoose to create a MongoDB collection (= "table") called "user"
// param #1: name of collection
// param #2: UserSchema defining the structure / type of data to be stored 
const User = mongoose.model("user", UserSchema);

// step 5: export the collection
// make the User "collection" / "class" / "model" available to other files
module.exports = User;