const router = require('express').Router()
const albumController = require('../controllers/album.controller')
const userAuth = require('../middlewares/auth.middleware').userAuth

router.get('/', albumController.showAll)
router.get('/:id', albumController.showSingleAlbum)
router.get('/myAlbums', userAuth, albumController.getMyAlbums)

router.post('/add', userAuth, albumController.addAlbum)

router.delete('/del/:id', userAuth, albumController.delAlbum)

router.patch('/edit:id', userAuth, albumController.editAlbum)


module.exports = router