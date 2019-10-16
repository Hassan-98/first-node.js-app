/**> Weather App <**/
const req = require("request")

const getLocation = (city, callback) => {
   const mapboxAPI = `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=pk.eyJ1IjoiaGFzc2FuYWxpOTgiLCJhIjoiY2sxa3V1dTl2MDAyeTNrcWxhcXBzNmV0YiJ9.6oDA-8l9nIqJACiHEa-Q-g&limit=1`

   req({url: mapboxAPI, json: true}, (err, res) => {
      if(err){
         callback("Error, Cannot Get The City", undefined)
      } else {
         var longitude = res.body.features[0].center[0]
         var latitude = res.body.features[0].center[1]
         var city = res.body.features[0].place_name
         callback(undefined, {city, longitude, latitude})
      }
      
   })
}

const getWeather = ({longitude, latitude, city}, callback) => {
   const weatherAPI = `https://api.darksky.net/forecast/5057df51e767e86cd64246cd853cb3df/${latitude},${longitude}?units=si&exclude=minutely,hourly,daily,alerts,flags`

   req({url: weatherAPI, json: true}, (err, res) => {
      if(err){
         callback("Error, Cannot Connect To Weather Service", undefined)
      } else {
         if(res.body.error){
            callback(res.body.error, undefined)
         } else {
            const {temperature, precipProbability, summary} = res.body.currently
            callback(undefined, {temperature, precipProbability, summary, city})
         }
      }
   });
}

module.exports = {
   getLocation, getWeather
}
