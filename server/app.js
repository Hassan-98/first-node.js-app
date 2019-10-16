// Core Modules
const path = require("path")
const express = require("express")
const hbs = require("hbs")
const mysql = require("mysql")
// Weather App Services
const weatherApp = require("./WeatherAppService")

// Firing Express
const app = express()
const port = process.env.PORT || 3000
// Folders Pathes
var publicFolder = path.join(__dirname, "../public")
var viewsFolder = path.join(__dirname, "../templates/pages")
var partialsFolder = path.join(__dirname, "../templates/components")

// Setting The View Engine
app.set('view engine', 'hbs')
// Setting The Views Directory
app.set('views', viewsFolder)
// Setting The Views Components
hbs.registerPartials(partialsFolder)
// Setting The Static Folder
app.use(express.static(publicFolder))

// Connect To MySQL Database
const connection = mysql.createConnection({
   host: "sql7.freemysqlhosting.net",
   user: "sql7308679",
   password: "D8WxSyDBZb",
   database: "sql7308679"
});


// The Home Page Route
app.get("/", (req, res) => {
   res.render("index", {
      title: "Home Page"
   })
})

// The Notes Page Route
app.get("/notes", (req, res) => {
   res.render("notes", {
      title: "Notes App"
   })
})

// Notes App API
app.get("/notes/api", (req, res) => {
   if(!req.query.type){
      connection.query("SELECT * FROM notes", (err, result) => {
         res.send(result)
      })
   } else {
      var type = req.query.type
      if(type == "add") {
         let title = req.query.title
         let body = req.query.body
         if(title && body){
            connection.query(`INSERT INTO notes (title, body) VALUES ('${title}', '${body}')`)
            connection.query("SELECT * FROM notes", (err, result) => {
               res.send(result)
            })
         } else {
            res.send({err: "Title Or Body is Missing"})
         }
      } else if (type == "remove"){
         let id = req.query.id
         if(id){
            connection.query(`DELETE FROM notes WHERE id = '${id}'`)
            connection.query("SELECT * FROM notes", (err, result) => {
               res.send(result)
            })
         } else {
            res.send({err: "ID is Missing"})
         }
      }
   }
})

// The Weather Page Route
app.get("/weather", (req, res) => {
   res.render("weather", {
      title: "Weather App"
   })
})

// The Weather API
app.get("/weather/api", (req, res) => {
   if(!req.query.city){
      return res.send({
         err: "You Must Provide A City"
      })
   } else {
      const searchCity = req.query.city
      weatherApp.getLocation(searchCity, (err, data) => {
         if(err) {
            return res.send({err})
         } else {
            var weatherInfo = {longitude: data.longitude, latitude: data.latitude, city: data.city}
            weatherApp.getWeather(weatherInfo, (err, data) => {
               if(err){
                  return res.send({err})
               } else {
                  return res.send(data)
               }
            })
         }
      })
   }
})

// The NotFound Page Route
app.get("*", (req, res) => {
   res.render("notFound", {
      err: "Page Is Not Found",
      title: "Not Found"
   })
})

// Creating A Server
app.listen(port, () => {
   console.log(`Server Is Started At Port ${port}`)
})