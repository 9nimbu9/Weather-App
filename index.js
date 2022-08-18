const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const { json } = require("body-parser")
var direction,temperature,humidity,windspeed,visibility,city,country,sunrise,sunset,sky,feels,iconId,location,placename =""

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname))
app.set("view engine","ejs")

app.get("/",function(req,res){
    res.render("index",{
        temp: temperature, humid: humidity, windspeed: windspeed, visi: visibility, sunset:sunset,
        sunrise: sunrise, city: city, country:country, icon: iconId, sky: sky, feels: feels,
        winddirection: direction
    })
})

app.post("/",function(req,res){
    const key = "fc17de71474c67a9f9797f7c2c85f2a3"
    location = req.body.city
    const weatherReport = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&appid="+key+"&units=metric"

    https.get(weatherReport,function(respond){
        respond.on("data",function(data){
            const jsonData = JSON.parse(data)
            placename = jsonData.id
            if(typeof placename==='undefined'){
                https.get(weatherReport)
            }else{
            temperature = Math.round(jsonData.main.temp)   
            humidity = jsonData.main.humidity
            windspeed = jsonData.wind.speed
            visibility = jsonData.visibility/1000
            city = jsonData.name
            country = jsonData.sys.country
            iconId = jsonData.weather[0].icon
            sky = jsonData.weather[0].description
            feels = Math.round(jsonData.main.feels_like)
            const degree = jsonData.wind.deg          

            if(degree>337.5){direction="N"}
            if(degree>292.5){direction="NW"}
            if(degree>247.5){direction="W"}
            if(degree>202.5){direction="SW"}
            if(degree>157.5){direction="S"}
            if(degree>122.5){direction="SE"}
            if(degree>67.5){direction="E"}
            if(degree>22.5){direction="NE"}
            else{direction="N"}
            

            var unixSet = jsonData.sys.sunset
            var dateSet = new Date((unixSet)*1000) 
            var unixRise = jsonData.sys.sunrise 
            var dateRise = new Date(unixRise*1000)

            if(dateRise.getMinutes()<10){
                sunrise = dateRise.getHours()+":0"+dateRise.getMinutes()
            }
            else{
                sunrise = dateRise.getHours()+":"+dateRise.getMinutes()            
            }
            if(dateSet.getMinutes()<10){
                sunset = dateSet.getHours()+":0"+dateSet.getMinutes()
            }
            else{
                sunset = dateSet.getHours()+":"+dateSet.getMinutes()
            }}
        })
        res.redirect("/")
    })
})
app.listen(process.env.PORT || 3000,function(){
    console.log("Server 3000")
})


const bangaloreReport = "https://api.openweathermap.org/data/2.5/weather?q=bangalore&appid=fc17de71474c67a9f9797f7c2c85f2a3&units=metric"
https.get(bangaloreReport,function(respond){
    respond.on("data",function(data){
        const jsonData = JSON.parse(data)
        placename = jsonData.name
        temperature = Math.round(jsonData.main.temp)   
        humidity = jsonData.main.humidity
        windspeed = jsonData.wind.speed
        visibility = jsonData.visibility/1000
        city = jsonData.name
        country = jsonData.sys.country
        iconId = jsonData.weather[0].icon
        sky = jsonData.weather[0].description
        feels = Math.round(jsonData.main.feels_like)
        const degree = jsonData.wind.deg          
        if(degree==360 && degree<90){direction="N"}
        else if(degree>=90 && degree<180){direction="E"}
        else if(degree>=180 && degree<270){direction="S"}
        else if(degree>=270 && degree<360){direction="W"}
        else{direction="N"}
          
        var unixSet = jsonData.sys.sunset
        var dateSet = new Date((unixSet)*1000) 
        var unixRise = jsonData.sys.sunrise 
        var dateRise = new Date(unixRise*1000)

        if(dateRise.getMinutes()<10){
            sunrise = dateRise.getHours()+":0"+dateRise.getMinutes()
        }
        else{
            sunrise = dateRise.getHours()+":"+dateRise.getMinutes()            
        }
        if(dateSet.getMinutes()<10){
            sunset = dateSet.getHours()+":0"+dateSet.getMinutes()
        }
        else{
            sunset = dateSet.getHours()+":"+dateSet.getMinutes()
        }
    })
})