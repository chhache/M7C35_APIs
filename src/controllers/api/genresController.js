const db = require('../../database/models');  // Variables de modelos de la BD
const sequelize = db.sequelize;             
const Op = db.Sequelize.Op;                // Exportar los Operadores de Sequelize

module.exports = {
    list: (req,res) => {                    // Endpoint Listado de Géneros
        db.Genre
            .findAll()                      // Buscar todos los géneros del modelo
            .then(genres => {               // Promesa recibe como parámetro los géneros
               return res.status(200).json({// Responde con el método JSON (envia info en formato JSON) los géneros.  Usamos solo render para vistas, ahora queremos generar un endpoint. Emplea código de status satisfactorio del request      
                   meta: {
                      status: 200,
                      total: genres.length, // Totaliza los géneros del modelo
                      url: "api/genres"  
                   },
                   data: genres             // Los datos del modelo
                   //status: 'ok'           // Estado de la consulta
               })  
            })       
    },
    detail: (req,res) => {                  // Endpoint Detalle de Género
        db.Genre
        .findByPk(req.params.id)            // Buscar por el ID de la URL
        .then(genre => {                    // Promesa recibe como un género
           return res.status(200).json({    // Responde con el método JSON (envia info en formato JSON) los géneros.  Usamos solo render para vistas, ahora queremos generar un endpoint. Emplea código de status satisfactorio del request      
            meta: {
                status: 200,
                total: 1,                   // Totaliza los géneros del modelo
                url: "api/genres/detail/" + req.params.id   
             },
            data: genre,                 // Los datos del género seleccionado por ID
            // status: 'ok'                 // Estado de la consulta
           })  
        })   
    },
    store: (req,res) => {
        // return res.json(req.body)         // Validar lo recibido en el endpoint del req.body enviado por petición tipo POST (EJ: Form)
        db.Genre                            // Datos enviados por método asincrónico desde un fornt-end -> form
        .create(req.body)                   // Usamos método create() de sequelize, por POST (body) y lo guardo
        .then(genre => {                    // Promesa recibe como un género
           return res.status(200).json({    // Responde con el método JSON (envia info en formato JSON) los géneros.  Usamos solo render para vistas, ahora queremos generar un endpoint. Emplea código de status satisfactorio del request      
               data: genre,                 // Los datos del género a crear
               created: 'ok'                 // Estado de la consulta
           })  
        })   
    },
    delete: (req,res) => {
        db.Genre                            // Datos enviados por método asincrónico desde un fornt-end -> form
        .destroy({                          // Usamos método delete() por DELETE
            where: {                        // El condicional que defini el filtro del registro a eliminar
                id: req.params.id           // ID que viaja por URL
            }                        
        })             
        .then(response => {                 // Promesa recibe parametro response que es el genero a eliminar
           return res.json(response)        // Método destroy() responde con 1 si la consulta es satisfactoria
    })
   },
   
   search: (req,res) => {
    // return res.json(req.body)         // Validar lo recibido en el endpoint del req.body enviado por petición tipo POST (EJ: Form)
    db.Genre                            // Datos enviados por método asincrónico desde un fornt-end -> form
        .findAll({                              // Podríamos usar findOne,
            where: {
                name: { [Op.like]: '%' + req.query.keyword + '%'}  // Empleamos el operador Like de Sequelize (definido al principio) y a traves del Query string de la URL busco la info (usamos los wilcard %)
            }
    })                   
    .then(genres => {                        // Promesa recibe como un género
       if (genres.length > 0){
        return res.status(200).json(genres)  // Envío los géneros encontrados (lo solicitado por el cliente o el que consume nuestra API)
       }else{
        return res.status(200).json('No se encontraron géneros con ese criterio')
       }        
    })   
    }
}