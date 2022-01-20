const path = require('path');
const db = require('../../database/models');  // Variables de modelos de la BD
const sequelize = db.sequelize;             
const { Op } = require("sequelize");                // Exportar los Operadores de Sequelize
const moment = require('moment');

module.exports = {
    create: (req, res) =>{
        db.Movie
            .create({                       // spread operator ...req.body (según lo solicitado)
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            })
        .then(movie => {
            return res.status(201).json({
                meta: {
                    status: 201,
                    total: 1,                   // Totaliza los géneros del modelo
                    url: "api/movies"   
                 },
                 data: movie           
             })
         })   
        .catch(error => res.status(500).json(error)) 
    },

    destroy: (req,res) =>{
        db.Movie                            // Datos enviados por método asincrónico desde un fornt-end -> form
        .destroy({                          // Usamos método delete() por DELETE
            where: {                        // El condicional que defini el filtro del registro a eliminar
                id: req.params.id           // ID que viaja por URL
            },
            force: true                        
        })             
        .then(response => {                 // Promesa recibe parametro response que es el genero a eliminar
           return res.status(200).json(response);        // Método destroy() responde con 1 si la consulta es satisfactoria
        })
        .catch(error => res.status(500).json(error))
    }
}
