const { request, response } = require('express');
const Asignacion = require('../models/asignacion');


const getAsignaciones = async (req = request, res = response) => {

    const query = { estado: true };
    const listaAsignaciones = await Promise.all([
        Asignacion.countDocuments(query),
        Asignacion.find(query)
            .populate('usuario', 'nombre')
            .populate('usuario', 'nombre')
            .populate('curso', 'nombre')
    ]);
    res.json({
        msg: 'get Api - Controlador Asignaciones',
        listaAsignaciones
    });
}

const getAsignacionPorID = async (req = request, res = response) => {
    const { id } = req.params;
    const asignacionById = await Asignacion.findById(id)
        .populate('usuario', 'nombre')
        .populate('curso', 'nombre');
    res.status(201).json(asignacionById);
}

const postAsignacion = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;
    const asignacionDB = await Asignacion.findOne({ nombre: body.nombre });

    if (asignacionDB) {
        return res.status(400).json({
            msg: `La asignacion ${asignacionDB.nombre}, ya existe`
        });
    }

    const query = { usuario: body.usuario };
    const existeAsignacion = await Asignacion.countDocuments(query);

    if (existeAsignacion >= 3) {
        res.json({
            msg: 'El usuario ya esta asignado a tres cursos'
        })
    }
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const asignacion = await Asignacion(data);
 
    await asignacion.save();
    res.status(201).json(asignacion);

}

const putAsignacion = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...restoData } = req.body;
    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }
    const asignacionActualizada = await Asignacion.findByIdAndUpdate(id, restoData, { new: true });
    res.status(201).json({
        msg: 'PUT',
        asignacionActualizada
    });
}

const deleteAsignacion = async (req = request, res = response) => {
    const { id } = req.params;

    const asignacionEliminada_ = await Asignacion.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json({
        msg: 'DELETE',
        asignacionEliminada_
    })
}

module.exports = {
    getAsignaciones,
    getAsignacionPorID,
    postAsignacion,
    putAsignacion,
    deleteAsignacion
} 