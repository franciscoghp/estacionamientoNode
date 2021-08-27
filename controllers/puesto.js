const { response, request } = require('express');

const Puesto = require('../models/puesto');

const getTiempo = () =>{
    const year = new Date().getFullYear()
    const mes = new Date().getMonth() + 1
    const dia = new Date().getDate()
    const hora = new Date().getHours()
    const minuto = new Date().getMinutes()
    const segundo = new Date().getSeconds()
    const tiempo = { year, mes, dia, hora, minuto,segundo } 
    return tiempo
}

const puestosGet = async(req, res = response) => {

    const puestos = await Puesto.find({})

    res.json({
        puestos
    });
}

const puestosPost = async(req, res = response) => {

    let puesto = {}

    puesto = new Puesto();
        res.status(201).json({
            puesto,
            message: 'El puesto fue agregado'
        });

    // Guardar en BD
    await puesto.save();
}

const puestosPut = async(req, res = response) => {

    const { id } = req.params;
    const { available, occupied, reserved, days, codigo } = req.body;
    let puesto = {}

    const tiempo = getTiempo( )
    let { fechaEntrada, intentos  } = await Puesto.findById( id );
    
    
    if(reserved && available){     // Condicion cuando paso de libre a reservado
        puesto.fechaEntrada = JSON.stringify( fechaEntrada )
        puesto.fechaSalida = JSON.stringify( tiempo )

        res.json({
            puesto,
            message: 'El puesto ahora está reservado'
        });

        await Puesto.findByIdAndUpdate( id, { 
            available : true, 
            occupied : false,
            reserved : true,
            fechaEntrada : ''
         } );
    }
    else if(!occupied && available){     // Condicion cuando paso de ocupado a disponible
        puesto.fechaEntrada = JSON.stringify( fechaEntrada )
        puesto.fechaSalida = JSON.stringify( tiempo )
        puesto.available = true
        puesto.occupied = false
        puesto.reserved = false

        res.json({
            puesto,
            message: 'El puesto ahora está libre'
        });

        await Puesto.findByIdAndUpdate( id, { 
            available : true, 
            occupied : false,
            reserved : false,
            fechaEntrada : ''
         } );
    }else if(occupied && !available && !reserved ){  // Condicion cuando paso de disponible a ocupado
        puesto.fechaEntrada = JSON.stringify( tiempo )
        puesto.available = false
        puesto.occupied = true
        puesto.reserved = false

        res.json({
            puesto,
            message: 'El puesto ahora está ocupado'
        });

        await Puesto.findByIdAndUpdate( id, puesto);
    }else if(reserved && available){ // Condicion cuando paso de disponible a reservado
        puesto.fechaEntrada = JSON.stringify( tiempo )
        puesto.available = false
        puesto.occupied = false
        puesto.reserved = true
        puesto.diasOcupado = days

        res.json({
            puesto,
            message: 'El puesto ahora está ocupado'
        });

        await Puesto.findByIdAndUpdate( id, puesto);
    }
    else if(reserved && occupied){ // Condicion cuando paso de reservado a ocupado
        puesto.fechaEntrada = JSON.stringify( tiempo )
        puesto.diasOcupado = days

        if(!intentos) intentos = 1


        if(intentos === 3){
            puesto.blocked = true
            puesto.intentos = 0
            res.status(400).json({
                 message: 'El puesto fue bloqueado por 5 horas'
            })

            await Puesto.findByIdAndUpdate( id, puesto);
            return setTimeout( async () => {
                puesto.blocked = false
                await Puesto.findByIdAndUpdate( id, puesto);
            }, 300000);
            
        }
        if(codigo != id){
            intentos += 1

            puesto.intentos = intentos
            res.status(400).json({
                message: 'Intento fallido, tiene máximo 3 intentos'
            })
            await Puesto.findByIdAndUpdate( id, puesto);
            return
        }else{
            puesto.available = false
            puesto.occupied = true
            puesto.reserved = true
            res.json({
                puesto,
                message: 'El puesto ahora está ocupado'
            })
            await Puesto.findByIdAndUpdate( id, puesto);
        }
    }
}

const puestosDelete = async(req, res = response) => {

    const { id } = req.params;
    await Puesto.findByIdAndRemove( id );
    
    res.json({
        message: 'el puesto con eliminado '
    });
}




module.exports = {
    puestosGet,
    puestosPost,
    puestosPut,
    puestosDelete,
}