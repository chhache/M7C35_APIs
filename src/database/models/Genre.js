// const { TINYINT, INTEGER } = require("sequelize/types");

module.exports = (sequelize, dataTypes) => {                // El modelo exporta una duncion con 2 parametros -> 1° conexión a la bd -> sequelize / 2° tipo de BD p/trabajar -> dataTypes
    let alias = 'Genre';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        ranking: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false
        },
        active: {
            type: dataTypes.BOOLEAN,
            allowNull: false
        }
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',                            // Sequelize supone que created_at y updated_at existen por defecto, de no ser asi -> definir como false
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Genre = sequelize.define(alias, cols, config);    // Const Genre, método .define con 3 parametros -> String nombre modelo (alias), Obj literal con las col de la tabla, config -> nombreTabla (sequelize la infere en plurarl del nombre del modelo)             

    Genre.associate = function(models) {                    // Definir las relaciones (1:N / N:1 / N:M) del modelo con el método .associate
        Genre.hasMany(models.Movie, {                       // models.Movies -> Movie es el valor de alias del modelo en movie.js
            as: "movies",                                   // Definir el alias de la relación con el que se lo va a llamar
            foreignKey: "genre_id"                          // Llave foránea de la realción en la tabla movies
        })
    }

    return Genre                                            // Retornar el valor de Genre, definido previamente como const
};