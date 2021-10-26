require('dotenv').config()
require('../db/connection')

const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes files 
const userRoutes = require('../routes/user.routes')
const galleryRoutes = require('../routes/gallery.routes')

app.use('/user', userRoutes)
app.use('/gallery', galleryRoutes)


module.exports = app