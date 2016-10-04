

Currently only 3 properties for validation, min, max and encrypt (boolean)

// will ensure user property is between 10 and 20 characters
var UserSchema = new hiddenSnow.Schema({
  user:{
    type: String,
    min: 10,
    max:20
  }
})

for encrypting a property:

var UserSchema = new hiddenSnow.Schema({
  user:{
    type: String,
    min: 10,
    max:20
  },
  password: {
    type: String,
    encrypt:true,
    min:10
  }
})
