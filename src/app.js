const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();



//Ejecuto el llamado a mis rutas
const indexRouter = require('./routes/index');
const moviesRoutes = require('./routes/moviesRoutes');
const genresRoutes = require('./routes/genresRoutes');
const apiGenresRoutes = require('./routes/api/genresRoutes');
const apiMoviesRoutes = require('./routes/api/moviesRoutes');

//Aquí pueden colocar las rutas de las APIs


// view engine setup
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../public')));

//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.json());  // Usar JSON para API
app.use(express.urlencoded({ extended: false }));

//Aquí estoy disponiendo la posibilidad para utilizar el seteo en los formularios para el uso de los metodos PUT/DELETE
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use(moviesRoutes);
app.use(genresRoutes);
app.use('/api/genres',apiGenresRoutes);
app.use('/api/movies',apiMoviesRoutes);


//Activando el servidor desde express
app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
