const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let loc
        if(req.user) loc = path.join("uploads", req.user._id.toString())
        else loc = path.join("uploads", "images")
        fs.mkdir(loc, (err)=>{})
        cb(null, loc)
    },
    filename: function(req, file, cb) {
        const myFileName = Date.now() + path.extname(file.originalname)
        cb(null, myFileName) 
    }
})

const fileFilter = (file, cb)=> {
    //if(!path.extname(file.originalname).endsWith([".png", ".jpg", ".jpeg", ".gif"]))
    //if(!path.extname(file.originalname.match(/\.(png|jpg|jpeg)$/)))
    if(path.extname(file.originalname) != ".png" | ".jpg" | ".jpeg" | ".gif" )    
        return cb(new Error("Invalid Image Format"))
    cb(null, true)
}

const uploader = multer({
    storage,
    limits: {fileSize: 200000000},
    fileFilter
})

module.exports = uploader