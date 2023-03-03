const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor() {
         
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/api/auth';
        this.usuariosPath = '/api/usuarios';
        this.categoriasPath = '/api/categorias'
        

        this.paths = {
            auth: '/api/auth',
            cursos: '/api/cursos',
            asignaciones: '/api/asignaciones',
            usuarios: '/api/usuarios'
        }

        this.conectarDB();

        this.middlewares();

        this.routes();

    }

    async conectarDB() {
        await dbConection();
    }

    middlewares() {

        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'));

    }


    routes() {
        this.app.use(this.paths.auth, require('../routes/auth')); 
        this.app.use(this.paths.cursos, require('../routes/curso'));
        this.app.use(this.paths.usuarios, require('../routes/usuario'));
        this.app.use(this.paths.asignaciones, require('../routes/asignacion'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        })
    }


}

module.exports = Server;