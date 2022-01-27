const path = require('path');
const db = require('../../database/models');        // Variables de modelos de la BD
const sequelize = db.sequelize;                     
const { Op } = require("sequelize");                // Exportar los Operadores de Sequelize
const moment = require('moment');
const fetch = require('node-fetch');    

module.exports = {
    // Opcional
    list: (req,res) => {                        // Endpoint Listado de Movies
        db.Movie
            .findAll()                          // Buscar todos las movies del modelo. Promesa -> ejecuta un bloque de código el cual tardará cierto tiempo,, luego en base a la respuesta podremos hacer algo -> .then
            .then(movies => {                   // Recibe como parámetro todos los géneros (resultado de la promesa) el .then continúa la secuencia de la promesa.  Permite a JS continue ejecutando otros procesos (Lengaujes sin promesas deben esperar se ejecute la acción para continuar).  Concatenar .catch(error) para capturar el error en caso que falle la promesa
               return res.status(200).json({    // Responde con el método JSON (envia info en formato JSON) los géneros.  Usamos solo render para vistas, ahora queremos generar un endpoint. Emplea código de status satisfactorio del request (hardcodeado)     
                   meta: {
                      status: 200,
                      total: movies.length,     // Totaliza las movies del modelo
                      url: "api/movies"  
                   },
                   data: movies                 // Los datos del modelo
                   //status: 'ok'               // Estado de la consulta
               })  
            })       
    },
    // Opcional
    detail: (req,res) => {                      // Endpoint Detalle de Género
        db.Movie
        .findByPk(req.params.id)                // Buscar por el ID de la URL -> Viene por GET api/movies/detail/:id
        .then(movie => {                        // Recibe una movie segun el ID de la URL
           return res.status(200).json({        // Responde con el método JSON (envia info en formato JSON) de la movie recibida.      
            meta: {
                status: 200,
                total: 1,                       // Totaliza las movies del modelo
                url: "api/movies/detail/" + req.params.id   
             },
            data: movie,                        // Los datos de la movie seleccionada por ID
            // status: 'ok'                     // Estado de la consulta
           })  
        })   
    },
    // Microdesafio - Paso 02
    create: (req, res) =>{
        db.Movie
            .create({                               // Endopoint crear Movies
                title: req.body.title,              // Podemos usar spread operator ...req.body (según lo solicitado) ó el deploy de cada ítem a leer del .body enviado por POST
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            })
        .then(movie => {                            // Recibe un parametro con la movie a crear
            return res.status(201).json({
                meta: {
                    status: 201,
                    total: 1,                       // Totaliza los géneros del modelo
                    url: "api/movies"   
                 },
                 data: movie                        // Movie a crear
             })
         })   
        .catch(error => res.status(500).json(error)) 
    },
    // Microdesafío - Paso 02
    destroy: (req,res) =>{                          // Endpoint DELETE    
        db.Movie                                    // Datos enviados por método asincrónico desde un fornt-end -> form
        .destroy({                                  // Usamos método destraoy() de Sequelize
            where: {                                // El condicional que define el filtro del registro a eliminar *** NO OLVIDAR ***
                id: req.params.id                   // ID que viaja por parámetro URL
            },
            force: true                        
        })             
        .then(response => {                         // Cumplida la promesa recibe parametro response 
           return res.status(200).json(response);   // Método destroy() responde con 1 si la consulta es satisfactoria -> se almcena en argumento response
        })
        .catch(error => res.status(500).json(error))
    },

    search: (req,res) => {
        db.Movie
        .findAll({
            where: {
                title: {
                    [Op.like]: '%' + req.query.titulo + '%' // http://www.omdbapi.com/?apikey=d4e35e92&t=Harry            
                } 
            }    
        })    
        .then(movies => {                           // Promesa recibe como parámetro las movies
            res.status(200).json({                  // Responde con el método JSON (envia info en formato JSON) las movies encontradas      
                meta: {
                //  status: res.status,
                  total: movies.length,             // Totaliza los géneros del modelo
                  url: "api/movies"  
               },
               data: movies                         // Los datos del modelo
            })  
        }) 
    }
}    
