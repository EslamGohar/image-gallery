const router = require('express').Router()
const UserController = require("../controllers/user.controller")
const userAuth = require("../middlewares/auth.middleware").userAuth
// const adminAuth = require("../middlewares/auth.middleware").adminAuth
const uploader = require("../middlewares/fileUploader")

router.post("/register", UserController.userRegister),
router.post("/login", UserController.userLogin),

//router.post("/addImages", userAuth, UserController.addImages)
router.post("/addImage", userAuth, uploader.single('image'), UserController.addImage),
router.post("/addAlbum", userAuth, uploader.array('images', 12), UserController.addAlbum),
router.post("/addimgtoalbum", userAuth, UserController.addImgToAlbum),
router.post("/addComment", userAuth, UserController.addComment),

router.patch("/activate/:id", UserController.activateUser),

router.get("/profile", userAuth, UserController.userProfile),
router.get("/logout", userAuth, UserController.logout),
router.get("/logoutall", userAuth, UserController.logoutAll),
router.get("/showalbum", userAuth, UserController.showAlbum),

router.delete("/delImage/:id", userAuth, UserController.deleteOneImg),
router.delete("delAlbum/:id", userAuth, UserController.delAlbum)



module.exports = router