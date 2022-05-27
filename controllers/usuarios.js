let Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const Bicicleta = require('../models/bicicleta')


module.exports = {

    list: function (req, res, next) {
        Usuario.find({}, (err, usuarios) => {
            res.render('usuarios/index', { usuarios: usuarios })
        })
    },

    update_get: function (req, res, next) {
        Usuario.findById(req.params.id, function (err, usuario) {
            res.render('usuarios/update', { errors: {}, usuario: usuario })
        })
    },

    update: function (req, res, next) {
        let update_values = { nombre: req.body.nombre }
        Usuario.findByIdAndUpdate(req.params.id, update_values, function (err, usuario) {
            if (err) {
                console.log(err)
                res.render('usuario/update', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) })
            }
            else {
                res.redirect('/usuarios')
                return
            }
        })
    },

    create_get: function (req, res, next) {
        res.render('usuarios/create', { errors: {}, usuario: new Usuario() })
    },

    create: function (req, res, next) {
        if (req.body.password != req.body.confirm_password) {
            res.render('usuarios/create', { errors: { confirm_password: { message: 'No coinciden los passwords ' } }, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) })
            return
        }
        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password }, function (err, nuevoUsuario) {
            if (err) {
                res.render('usuarios/create', { errors: { email: { message: 'Ya existe un usuario con ese password' } }, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) })
            }
            else {
                nuevoUsuario.enviar_mail_bienvenida()
                res.redirect('/usuarios')
            }
        })
    },


    delete: function (req, res, next) {
        Usuario.findByIdAndDelete(req.body.id, function (err) {
            if (err)
                next(err)
            else
                res.redirect('/usuarios')
        })
    },


    login_get: function (req, res, next) {
        res.render('usuarios/login', { errors: { message: '' } })
    },

    login_post: async function (req, res, next) {
        if (!req.body.password || !req.body.email) {
            res.render('usuarios/login', { errors: { message: 'Favor de llenar ambos campos' } })
            return
        }
        //Login
        const body = req.body;
        const user = await Usuario.findOne({ email: body.email });
        if (user) {
            // check user password with hashed password stored in the database
            const validPassword = await bcrypt.compare(body.password, user.password);
            if (validPassword) {
                //Crear sesión y redireccionar a la parte segura de reserva de bicis:
                session = req.session;
                session.userid = req.body.email;
                console.log(req.session)
                res.redirect('../bicicletas/reservar')
                return
            } else {
                res.render('usuarios/login', { errors: { message: 'Password incorrecto' } })
                return
            }
        } else {
            res.render('usuarios/login', { errors: { message: 'No existe ese usuario' } })
            return
        }
    },

}


