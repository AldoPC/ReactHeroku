const Bicicleta = require('../models/bicicleta')
const Usuario = require('../models/usuario')
const Reserva = require('../models/reserva')


exports.bicicleta_list = function (req, res) {
    Bicicleta.find({}, function (err, bicis) {
        if (err) console.log(err)
        res.render('bicicletas/index', { bicis: bicis, u: req.session.userid })
    })
}


exports.bicicleta_list_reserva_get = function (req, res) {
    Bicicleta.find({}, function (err, bicis) {
        if (err) console.log(err)
        //Checar sesión
        session = req.session;
        if (session && session.userid) {

            /*
            Reserva.find({}, (err, reservas) => {
                console.log("reservas:")
                console.log(reservas)
                res.render('bicicletas/reservar', { bicis: bicis, uid: session.userid, reservas: reservas })
            })
            */
            Reserva.
                find({}).
                populate('bicicleta').
                populate('usuario').
                exec(function (err, reservas) {
                    if (err) return handleError(err);
                    console.log(reservas);
                    res.render('bicicletas/reservar', { bicis: bicis, uid: session.userid, reservas: reservas })
                });


        } else {
            res.redirect('/')
        }
    })
}
exports.bicicleta_list_reserva_post = function (req, res) {

    //Encontrar al usuario que hará la reserva
    Usuario.findByEmail(req.body.uid, function (err, usuario) {
        if (err) {
            console.log(err)
        }
        //Encontrar la bicicleta que se reservará
        Bicicleta.findByCode(req.body.code, function (err, bici) {
            if (err) {
                console.log(err)
            }
            //Hacer la reserva
            console.log("haciendo la reserva")
            let hoy = new Date()
            let mañana = new Date()
            mañana.setDate(hoy.getDate() + 1)
            usuario.reservar(bici.id, hoy, mañana, function (err, reserva) {
                if (err) {
                    console.log(err)
                }
                Bicicleta.find({}, function (err, bicis) {
                    if (err) console.log(err)
                    //Checar sesión
                    session = req.session;
                    if (session && session.userid) {
                        res.redirect('reservar')
                    } else {
                        res.redirect('/')
                    }
                })
            })
        })
    })

}

exports.bicicleta_create_get = function (req, res) {
    res.render('bicicletas/create')
}

exports.bicicleta_create_post = function (req, res) {
    let bici = Bicicleta.createInstance(req.body.id, req.body.color, req.body.modelo, [req.body.lon, req.body.lat])
    Bicicleta.add(bici)
    res.redirect('/bicicletas')
}

exports.bicicleta_delete_post = function (req, res) {
    Bicicleta.removeByCode(req.body.code).then(function () {
        res.redirect('/bicicletas')
    })
}

exports.bicicleta_update_get = function (req, res) {

    Bicicleta.findOne({ code: req.params.id }).then(function (bici) {
        res.render('bicicletas/update', { bici: bici })
    });
}

exports.bicicleta_update_post = function (req, res) {
    Bicicleta.findOne({ code: req.params.id }).then(function (bici) {
        bici.id = req.body.id
        bici.color = req.body.color
        bici.modelo = req.body.modelo
        bici.ubicacion = [req.body.lon, req.body.lat]
        bici.save()
        res.redirect('/bicicletas')
    });

} 