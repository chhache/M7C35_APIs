const db = require('../../database/models');    // Variables de modelos de la BD
const sequelize = db.sequelize;                 // Requiere el método sequelize (ORM -> Object-Relational Mapping - paquete de Node) de la variable DB (modelos BD)
const Op = db.Sequelize.Op;                     // Exportar los Operadores -> Sequelize Ej: .like

// Object –> Hace referencia al/los objeto(s) que podemos usar en nuestro lenguaje.
// Relational –> Hace referencia a nuestro Sistema Gestor de Base de Datos (MySQL, MSSQL, PostgreSQL).
// Mapping –> Hace referencia a la conexión entre el los objetos y las tablas.
// Sequelize es un ORM basado en promesas para Node.js (va de la mano con el event loop de Node.js = back-end JS) -> Soporta MySQL, PostgreSQL, SQLite, MS-SQL (relacionales)
// Instalar sequelize sequelize-cli (npm i sequelize@5.21), decir conque BD se trabajará -> npm i MySQL, iniciar el proy sequelize -> sequelize init 
// Seguir sequencia -> Ruta / Controlador / Vista ( + modelo) 
// Conjunto de endpoint = API
// Usamos cliente REST -> Postman para probar el codigo de cada endpoint

module.exports = {                              // Exportamos el módulo
    // Microdesafío - Paso 01
    list: (req,res) => {                        // Endpoint Listado de Géneros
        db.Genre
            .findAll()                          // Buscar todos los géneros del modelo. Promesa -> ejecuta un bloque de código el cual tardará cierto tiempo,, luego en base a la respuesta podremos hacer algo -> .then
            .then(genres => {                   // Recibe como parámetro todos los géneros (resultado de la promesa) el .then continúa la secuencia de la promesa.  Permite a JS continue ejecutando otros procesos (Lengaujes sin promesas deben esperar se ejecute la acción para continuar).  Concatenar .catch(error) para capturar el error en caso que falle la promesa
               return res.status(200).json({    // Responde con el método JSON (envia info en formato JSON) los géneros.  Usamos solo render para vistas, ahora queremos generar un endpoint. Emplea código de status satisfactorio del request (hardcodeado)     
                   meta: {
                      status: 200,
                      total: genres.length,     // Totaliza los géneros del modelo
                      url: "api/genres"  
                   },
                   data: genres                 // Los datos del modelo
                   //status: 'ok'               // Estado de la consulta
               })  
            })       
    },
    // Microdesafío - Paso 01
    detail: (req,res) => {                      // Endpoint Detalle de Género
        db.Genre
        .findByPk(req.params.id)                // Buscar por el ID de la URL -> Viene por GET api/genres/detail/:id
        .then(genre => {                        // Recibe un género segun el ID de la URL
           return res.status(200).json({        // Responde con el método JSON (envia info en formato JSON) el género recibido.      
            meta: {
                status: 200,
                total: 1,                       // Totaliza los géneros del modelo
                url: "api/genres/detail/" + req.params.id   
             },
            data: genre,                        // Los datos del género seleccionado por ID
            // status: 'ok'                     // Estado de la consulta
           })  
        })   
    },
    // Opcional 
    store: (req,res) => {                       // Crear Género -> Método POST (emular recepción de datos asincronos -> Ej: Form)
        // return res.json(req.body)            // Validar lo recibido en el endpoint del req.body enviado por petición tipo POST (EJ: Form)
        db.Genre                                // Datos enviados por método asincrónico desde un fornt-end -> form
        .create(req.body)                       // Usamos método create() de sequelize, por POST (body) y lo guardo = name: req.body.name ó ...req.body (spread operator)
        .then(genre => {                        // Recibe el género a crear
           return res.status(200).json({        // Responde con el método JSON (envia info en formato JSON) los géneros.  Usamos solo render para vistas, ahora queremos generar un endpoint. Emplea código de status satisfactorio del request      
               data: genre,                     // Los datos del género a crear recibido por POST
               created: 'ok'                    // Estado de la consulta
           })  
        })   
    },
    // Opcional
    delete: (req,res) => {                      // Eliminar Género
        db.Genre                                // Datos enviados por método asincrónico desde un fornt-end -> form
        .destroy({                              // Usamos método destroy() de Sequelize (Usar siempre -> Where)
            where: {                            // El condicional que defini el filtro del registro a eliminar, sino elimina todo los datos del modelo
                id: req.params.id               // ID que viaja como parametro por URL
            }                        
        })             
        .then(response => {                     // Recibe del CallBack un parametro -> response 
           return res.json(response)            // Método destroy() responde con 1 si la consulta es satisfactoria
    })
   },
   // Opcional
   search: (req,res) => {                       // Buscar Género
    // return res.json(req.body)                // Validar lo recibido en el endpoint del req.body enviado por petición tipo POST (EJ: Form)
    db.Genre                                    // Datos enviados por método asincrónico desde un fornt-end -> form
        .findAll({                              // Podríamos usar findOne,
            where: {
                name: { [Op.like]: '%' + req.query.keyword + '%'}  // Empleamos el operador Like de Sequelize (definido al principio) y a traves del Query string de la URL busco la info (usamos los wilcard %) -> ?keyword=
            }
    })                   
    .then(genres => {                           // Recibe todos los géneros que conicidan con el Query String definido 
       if (genres.length > 0){                  // Si es > a 0 (osea tiene resultados el array de objetos literales)
        return res.status(200).json(genres)     // Retorna todos los géneros encontrados (lo solicitado por el cliente o lo que consume nuestra API -> función para la que fue creada)
       }else{
        return res.status(200).json('No se encontraron géneros con ese criterio')
       }        
    })   
    }
}