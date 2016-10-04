"use strict";

var crypto = require("crypto");




var createSalt = function(length){
  return crypto.randomBytes(Math.ceil(length/2)).toString("hex");
}


var encrypt = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};


function saltHashPassword(userpassword) {
    var salt = createSalt(16);
    var passwordData = encrypt(userpassword, salt);
    var passwordHashHolder = passwordData.passwordHash;

    return {
      salt: salt,
      pass: passwordHashHolder
    };
}

function validateObject(schema, objectInCreation, callback){
  var errorArr = [];
  if (Object.getOwnPropertyNames(schema).length !== 0){
    var props = Object.getOwnPropertyNames(schema);
    for (var i = 0; i < props.length; ++i){
      var validProps = Object.getOwnPropertyNames(schema[props[i]]);
      for (var j = 0; j < validProps.length; ++j){
        if (objectInCreation[props[i]] == undefined) continue;
        var checkedValueMarker = schema[props[i]]["type"] == String ? objectInCreation[props[i]].length : objectInCreation[props[i]];
        switch(validProps[j]){
          case "min":
            if (checkedValueMarker < schema[props[i]]["min"]){
              errorArr.push(objectInCreation[props[i]] + " exceeds the minimum schema requirements!");
              break;
            }
            break;
          case "max":
            if (checkedValueMarker > schema[props[i]]["max"]){
              errorArr.push(objectInCreation[props[i]] + " exceeds the maximum schema requirements!");
              break;
            }
            break;
          case "encrypt":
            if (schema[props[i]]["encrypt"] == true){
              var encryptedData = saltHashPassword(objectInCreation[props[i]]);
              objectInCreation[props[i]] = {
                hash: encryptedData.pass,
                salt: encryptedData.salt
              };
              break;
            }
            break;
        }
      }
    }
    callback(errorArr, objectInCreation);
  }
  else {
    errorArr.push("The schema has no properties to validate object against!");
    callback(errorArr, objectInCreation);
  }
}


function Schema(object){
  var props = Object.getOwnPropertyNames(object);
  for (var i = 0; i < props.length; ++i){
    this[props[i]] = object[props[i]];
  }
}

Schema.prototype.validate = function(object, callback){
  var timeStamp = Number(new Date().getTime());
  validateObject(this, object, function(errArr, created){
    if (errArr.length > 0){
      var err = errArr.join();
      callback(err);
    }
    else {
      var finishTime = Number(new Date().getTime());
      console.log("Operation took: " + (finishTime - timeStamp) + " ms.");
      callback(null, created);
    }
})
};






module.exports = {
  Schema: Schema,
}
