const express = require('express');
const router = express.Router();
const genresController = require('../../controllers/api/genresController');

router.get('/', genresController.list);
router.get('/search', genresController.search);              // Endpoint search   
router.get('/detail/:id', genresController.detail);
router.post('/', genresController.store);            // Definir que datos obligatorios enviar por POST para el create()
router.delete('/:id', genresController.delete);

module.exports = router;