
const { Schema, model } = require('mongoose');

const PuestoSchema = Schema({
    available: {
        type: Boolean,
        default: true,
        required: true
    },
    occupied : {
        type: Boolean,
        default: false,
        required: true
    },
    reserved: {
        type: Boolean,
        default: false,
        required: true
    },
    fechaEntrada: {
        type: String,
    },
    fechaSalida: {
        type: String,
    },
    diasOcupado: {
        type: Number,
    },
    intentos: {
        type: Number,
    },
    blocked: {
        type: Boolean,
    },
});

PuestoSchema.methods.toJSON = function() {
    const { __v, _id, ...puesto  } = this.toObject();
    puesto.id = _id;
    return puesto;
}

module.exports = model( 'Puesto', PuestoSchema );
