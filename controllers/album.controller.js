const AlbumModel = require("../db/models/images.model")

class albumController {

    static showAll = async (req, res) => {
        try {
            const albums = await AlbumModel.find()
            res.send({ apiStatus: true, data: albums, message: "albums loaded successfully" })
        }
        catch (e) {
            res.status(500).send({ apiStatus: false, data: e.message, message: "error loading albums" })
        }
    }

    static showSingleAlbum = async (req, res) => {
        try {
            const album = await AlbumModel.findById({ _id: req.params.id })
            res.send({ apiStatus: true, data: album, message: "album loaded successfully" })
        }
        catch (e) {
            res.status(500).send({ apiStatus: false, data: e.message, message: "error loading album" })
        }
    }

    static addAlbum = async(req, res)=>{
        try{
            const album = new AlbumModel({
                userId: req.user._id,
                ...req.body
            })
            await album.save()
            res.send({ apiStatus: true, data: album, message: "album added successfully" })
        }
        catch(e){
            res.status(500).send({apiStatus: false, data: e.message, message: "error adding album"})
        }
    }

    static getMyAlbums = async(req, res) => {
        try{
            await req.user.populate('myAlbum')
            res.send({ apiStatus: true, data: req.user.myAlbum, message: "jobs loaded successfully" })
        }
        catch(e){
            res.status(500).send({apiStatus: false, data: e.message, message: "error showing album"})
        }
    }

    static delAlbum= async(req,res) =>{
        try{
            await AlbumModel.findByIdAndDelete(req.params.userId)
            if(!AlbumModel) res.status(404).send({apiStatus: false, data:"", message: "Album not found"})
        }
        catch(e){
            res.status(500).send({apiStatus: false, data: e.message, message: "error deleting album"})
        }
    }

    static editAlbum = async (req, res) => {
        try {
            let album = await AlbumModel.updateOne({ _id: req.params.id }, { $set: req.body })
            await album.save()
            res.status(200).send({
                apiStatus: true,
                data: album,
                message: "album data updated"
            })
        } catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: 'error in editing album',
                data: e.message
            })
        }
    }

}

module.exports = albumController;