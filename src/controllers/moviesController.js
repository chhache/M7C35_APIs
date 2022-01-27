const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;                     // Requerimos métodos de sequelize
const { Op } = require("sequelize");                // Requerimos los operadores de sequeliza EJ: Op.like
const moment = require('moment');                   // Formatea las fechas 
const fetch = require('node-fetch');                // Requerimos node-fetch -> modulo de Node.js para trabajar con APIs de terceros


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include : ['genre']
            })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
        .catch(error => res.send(error))
    },
    create: function (req,res) {
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
        )
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    edit: function(req,res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            Movie.release_date = moment(Movie.release_date).format('L');
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
        .catch(error => res.send(error))
    },
    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })
        .then(()=> {
            return res.redirect('/movies')})            
        .catch(error => res.send(error))
    },
    delete: function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})})
        .catch(error => res.send(error))
    },
    destroy: function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true}) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error)) 
    },
    // Microdesafío - Paso 01
    // Las APIs de terceros se consumiran a partir de pedidos asincronos.  Podemos saber en que momento se encía la petición al servidor API, pero no contar con la certeza de cdo obtendremos el resultado, node-fetch es el paquete de Node.js que nos facilita interactuar con APIs de terceros.
    // Dos o más APIs -> async & await
    // EJ:
    // module.exports={
    //     list: async (req,res) => {
    //       let countries = await fetch('https://restcountries.eu/rest/v2/all')
    //         .then(response=> response.json()); 
    //       let provinces = await fetch('https://apis.datos.gob.ar/georef/api/provincias')
    //         .then(response=> response.json()); 
      
    //       return res.json({
    //         countries, provinces
    //       })          
    //     },
    //   }
    search: (req,res) => {                                                // Método search   
        if(req.query.titulo){                                             // Recibe de un callback como parámetro el titulo de la película a través de un Query String  
            db.Movie                                                      // El Callback conecta al modelo Movie  
        .findAll({                                                        // Busca todas las movies   
            where: {                                                      // Que conicidan con lo recibido por POST (método asíncrono recibido por Form)  
                title: {                                                  // El campo title 
                    [Op.like]: '%' + req.query.titulo + '%'               // "like" = % palabraBuscar % -> usa wilcards para completar los caracteres  
                } 
            }    
        })    
        .then(movies => {                                                 // Recibe de la promesa la movie a buscar
           if(movies.length > 0) {                                        // Si el array de objetos es > a 0 (osea existen movies)  
                res.render('moviesList', {movies})                        // Si es true ->   renderiza movieList.ejs con el clave:valor resultante de la consulta {movie:movie}
           }else{                                                         // Si es false  
               fetch('http://www.omdbapi.com/?apikey=d4e35e92&t=' + req.query.titulo) //  Ir a buscar: www.site.com -> promesa en un .then (devuelve la respuesta de la petición), Esa petición tambien es una promesa, por ello vamos a pedir que esa respuesta sea, procesada en un formato json ( a traves de otro then)    
               .then(movie => {                                           // En el 2° .then puedo trabajar con la información que llega de la API, idem lógica anterior {movie:movie}
                    res.render('moviesDetailOmdb', {movie})
               })
           }            
        })
        }else{                                                             // Sino existe en la BD local o externa (consultada a traves de API con fetch) 
            res.render('moviesList', {movies: []})                         // Renderizar la vista -> moviesList.ejs sin valor (misma lógica anterior pero pasar un array vacio)                   
        }
         
    }

}

module.exports = moviesController;