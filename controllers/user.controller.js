const User = require('../db/models/user.model')
const AlbumModel = require("../db/models/images.model")
const emailSetting = require("../helper/email.helper")
const generateTxt = require("../helper/generateEmailTxt")

class UserController {
    
    static userRegister = async(req, res)=>{
        try{
            let user = new User(req.body)
            await user.save()
            emailSetting(user.email, generateTxt(), "new registeration" )
            res.send({apiStatus: true, message: "registered", data: user})
        }
        catch(e) {
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message:"error in adding user"
            })
        }
    }

    static activateUser = async(req,res) =>{
        let userId = req.params.id
        try{
            let user = await User.findById(userId)
            if(!user) res.status(404).send({
                apiStatus:false, 
                message:"user not found",
                data:""
            })
            user.status=true
            await user.save()
            res.status(200).send({
                apiStatus:true,
                message:"registered",
                data: user
            })
        }
        catch(e){
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message:"error in activate user"
            })
        }
    }
    
    static userLogin = async(req,res)=>{
        try{
            const userData = await User.loginUser(req.body.email, req.body.password)
            const token = await userData.generateToken()
            res.status(200).send({
                apiStatus:true, 
                data:{userData, token}, 
                message:"logged in success"
            })
        }
        catch(e){
            res.status(500).send({
                apiStatus: false, 
                data:e.message, 
                message:"invalid login"
            })
        }
    }

    static userProfile = async(req,res)=>{
        try {
            res.status(200).send({ 
                apiStatus: true, 
                data: req.user, 
                message: "user data loaded"
            })
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'error in loading profile',
                data: e.message
            })
        }
    }

    static logout = async(req, res)=>{
        try{
            req.user.tokens = req.user.tokens.filter(el => el.token != req.token)
            await req.user.save()
            res.send({
                apiStatus: true,
                message: "user logged out"
            })
        }
        catch(e){  
            res.status(500).send({
                apiStatus: false,
                message: 'error in logging out',
                data: e.message
            }) 
        }
    }

    static logoutAll = async(req, res)=>{
        try{
            req.user.tokens = []
            await req.user.save()
            res.send({
                apiStatus: true,
                data: "",
                message: "user logged ALL out"
            })
        }
        catch(e){ res.send(e) }
    }

    static addImage = async(req, res)=>{
        try {
            if(!req.file) throw new Error("file not found")
            req.user.image = req.file.path  // .replaceAll('\\', '/')
            await req.user.save()
            res.status(200).send({
                apiStatus: true,
                data: req.user,
                message: "profile image added"
            })
        }
        catch(e){ res.status(500).send({apiStatus: false, data: e.message, message: "Error adding image"}) }
    }

    // static addImages = async(req, res)=>{
    //     try{
    //         req.user.image.push(req.body)
    //         res.send(req.user)
    //         await req.user.save()
    //         res.status(200).send({apiStatus: true, data: req.user, message: "Image added successfuly"})
    //     }
    //     catch(e){ res.status(500).send({ apiStatus: false, data: e.message, message: "error in adding image" }) }
    // }

    static deleteOneImg = async(req, res)=>{
        try {
            //let img = await req.user.image.deleteOne({ _id: req.params.id })
            let img = await req.user.image.findByIdAndDelete(req.params.id)
            if(!img) res.status(404).send({apiStatus: false, data:"", message:"image not found"})
            res.status(200).send({
                apiStatus: true,
                data: req.user,
                message: "Image deleted!"
            })
        }
        catch(e) {
            res.status(500).send({apiStatus:false, data: e.message, message:"error deleting image"})
        }
    }

    // Album

    static addAlbum = async(req, res)=>{
        try{
            //const album = new AlbumModel(req.body)
            req.user.album.push(req.body)
            await album.save()
            res.status(200).send({
                apiStatus: true,
                data: req.user.album,
                message: "Album added successfuly"
            })
        }
        catch(e){
            res.status(500).send({apiStatus: false, data: e.message, message: "error adding album"})
        }
    }

    static showAlbum = async(req, res) =>{
        try{
            await req.user.populate('myAlbum')
            res.status(200).send({
                apiStatus: true,
                data: req.user.myAlbum,
                message:"Album Listed"
            })
        }
        catch(e){
            res.status(500).send({apiStatus: false, data: e.message, message: "error showing album"})
        }
    }

    static delAlbum = async(req,res) =>{
        try{
            const album = new AlbumModel()
            await album.findByIdAndDelete(req.user.userId)
            //await album.deleteOne({id: req.params.id})
            if(!album) throw new Error('Album not found')
            
            res.status(200).send({apiStatus:true, message:album, data:[]})
        }
        catch(e){
            res.status(500).send({apiStatus: false, data: e.message, message: "error deleting album"})
        }
    }

    static addImgToAlbum = async(req, res)=>{
        try{
            let album = req.user.album
            let img = req.user.image
            album.push(img)
            await req.user.save()
            res.status(200).send({
                apiStatus:true, 
                data: req.user.album,
                message:"Image added into Album"})
        }
        catch(e){ 
            res.status(500).send({apiStatus:false, data: e.message, message:"error adding image to album"})
        }
    }

    static addComment = async(req, res)=>{
        try{
            req.user.comment.push(req.body)
            await req.user.save()
            res.status(200).send({
                apiStatus: true,
                data: req.user,
                message: "comment added successfully"
            })
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error adding skill"
            })
        }   
    }
}

module.exports = UserController