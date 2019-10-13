const fs = require('fs')
const path = require("path")

// Adding An Item To Database
const add = (path, item) => {
   // Reading Database
   let db = loadDB()

   item["_id"] = item.title

   if (path && !path.includes("/")){
      db[path] = item
   } else if (path && path.includes("/")){
      var pathes = path.split("/")
      var data = [];
      var main = db;
      for(var k = 0; k < pathes.length; k++){
         if(main[pathes[k]]) {
            data.push(main[pathes[k]])
            main = main[pathes[k]]
         } else {
            data.push({})
            main = {}
         }
      }
      data[pathes.length - 1] = item
      for(var z = pathes.length - 1; z > 0; z--){
         var y = z - 1;
         data[y][pathes[z]] = data[z]
      }
      db[pathes[0]] = data[0]
   } else {
      db = item
   }

   // Saving to Database
   saveDB(db)
}

// Pushing An Item To Database
const push = (path, item) => {
   // Reading Database
   let db = loadDB()

   // Creating a unique key
   let letters = ["a","b","c","d","e","f","g","h","i","g","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9","0"]
   var key = '';
   for(var i = 0; i < 16; i++) {
      let random = Math.floor(Math.random() * letters.length)
      key += letters[random]
   }

   item["_id"] = key

   if (path && !path.includes("/")){
      db[path][key] = item
   } else if (path && path.includes("/")){
      var pathes = path.split("/")
      var data = [];
      var main = db;
      for(var k = 0; k < pathes.length; k++){
         if(main[pathes[k]]) {
            data.push(main[pathes[k]])
            main = main[pathes[k]]
         } else {
            data.push({})
            main = {}
         }
      }
      data[pathes.length - 1][key] = item
      for(var z = pathes.length - 1; z > 0; z--){
         var y = z - 1;
         data[y][pathes[z]] = data[z]
      }
      db[pathes[0]] = data[0]
   } else {
      db[key] = item
   }

   // Saving to Database
   saveDB(db)
}

// Removing An Item From Database
const remove = path => {
   // Reading Database
   let db = loadDB()

   if (path && !path.includes("/")){
      if (db[path]){
         delete db[path]
      } else {
         console.log("Item Not Found")
      }
   } else if (path && path.includes("/")){
      var pathes = path.split("/")
      var data = [];
      var main = db;
      for(var k = 0; k < pathes.length; k++){
         if(main[pathes[k]]){
            data.push(main[pathes[k]])
            main = main[pathes[k]]
         } else {
            throw Error("Item Not Found")
         }
      }

      if (data[pathes.length - 1]){
         delete data[pathes.length - 1]
      } else {
         throw Error("Item Not Found")
      }

      for(var z = pathes.length - 1; z > 0; z--){
         var y = z - 1;
         data[y][pathes[z]] = data[z]
      }
      db[pathes[0]] = data[0]
   } else {
      throw Error("Cannot Remove Hole Database")
   }

   // Saving to Database
   saveDB(db)
}

// Getting An Item From Database
const get = path => {
   let db = loadDB()
   
   if (path && !path.includes("/")){
      if (db[path]){
         return db[path]
      } else {
         throw Error("Item Not Found")
      }
   } else if (path && path.includes("/")){
      var pathes = path.split("/")
      var data = [];
      var main = db;
      for(var k = 0; k < pathes.length; k++){
         if(main[pathes[k]]){
            data.push(main[pathes[k]])
            main = main[pathes[k]]
         } else {
            throw Error("Item Not Found")
         }
      }
      return data[pathes.length - 1]
   } else {
      return db
   }
}


// Update An Item In Database
const update = (path, item) => {
   // Reading Database
   let db = loadDB()

   if (path && !path.includes("/")){
      if(db[path]){
         for(var i in item){
            db[path][i] = item[i]
         }
      } else {
         db[path] = {}
         for(var i in item){
            db[path][i] = item[i]
         }
      }
   } else if (path && path.includes("/")){
      var pathes = path.split("/")
      var data = [];
      var main = db;
      for(var k = 0; k < pathes.length; k++){
         if(main[pathes[k]]) {
            data.push(main[pathes[k]])
            main = main[pathes[k]]
         } else {
            data.push({})
            main = {}
         }
      }
      if(data[pathes.length - 1]){
         for(var i in item){
            data[pathes.length - 1][i] = item[i]
         }
      } else {
         data[pathes.length - 1] = {}
         for(var i in item){
            data[pathes.length - 1][i] = item[i]
         }
      }
      for(var z = pathes.length - 1; z > 0; z--){
         var y = z - 1;
         data[y][pathes[z]] = data[z]
      }
      db[pathes[0]] = data[0]
   } else {
      for(var i in item){
         db[i] = item[i]
      }
   }

   // Saving to Database
   saveDB(db)
}

const loadDB = () => {
   // Reading Database
   try {
      var filePath = path.join(__dirname + "\\db.json")
      let buffer = fs.readFileSync(filePath)
      let string = buffer.toString()
      let cleanString = string.replace(/^\ufeff/g,"")
      return JSON.parse(cleanString)
   } catch (e) {
      return {}
   }
}

const saveDB = db => {
   var filePath = path.join(__dirname + "\\db.json")
   let JSON_DB = JSON.stringify(db)
   fs.writeFileSync(filePath, JSON_DB)
}

module.exports = {
   add, push, remove, get, update
}