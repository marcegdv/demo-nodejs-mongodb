import { dbConnect, dbDisconnect, dbCreate, dbRead, dbUpdate, dbDelete } from './mdb.example';
import dotenv from 'dotenv';
import MongoClient from 'mongodb';

dotenv.config();

const mdbUser = process.env.DB_USER;
const mdbPass = process.env.DB_PASS;
const mdbCluster = process.env.DB_CLUSTER;
const mdbClusterUrl =process.env.DB_CLUSTER_URL;
const mdbName = process.env.DB_NAME;
const mdbOptions = process.env.DB_OPTIONS;
const url = 'mongodb+srv://' + mdbUser + ':' + mdbPass + '@' + mdbCluster + '.' + mdbClusterUrl + '/' + mdbName + '?' + mdbOptions;
const dataBase = new MongoClient(url);

//-------------------------------------------------------------------------------[ Create ] -----
async function AgregarProducto(producto) {
    return await dbCreate('productos', producto);
}

//-------------------------------------------------------------------------------[ Read ] -----
async function BuscarProducto(criterio) {
    return await dbRead('productos', criterio);
}

//-------------------------------------------------------------------------------[ Update ] -----
async function ActualizarProducto (criterio, atributos) {
    return await dbUpdate('productos', criterio, atributos);
}

//-------------------------------------------------------------------------------[ Delete ] -----
async function EliminarProducto(criterio) {
    return await dbDelete('productos', criterio);
}

//-------------------------------------------------------------------------------[ Main ] -----
async function main() {
    const producto1 = { tipo: 'alimento', nombre: 'arroz', cantidad: 500, udm: 'gramos', precio: 50, stock: 23 };
    const producto2 = { tipo: 'bebida', nombre: 'soda', cantidad: 1.5, udm: 'litros', precio: 20, stock: 40 };
    const lista = [producto1, producto2];

    await dbConnect();

    await AgregarProducto(lista);
    //await AgregarProducto('{"tipo":"limpieza"}');
    //await AgregarProducto('[{"tipo":"alimento","nombre":"carne"},{"tipo":"bebida","nombre":"vino"}]');

    await BuscarProducto({});
    //await BuscarProducto({tipo:'alimento'});

    //await EliminarProducto({tipo:'bebida'});

    //await BuscarProducto({nombre:'arroz'});
    //await ActualizarProducto([{nombre:'arroz'}], '{$set: {marca:"Marolio"}}');
    //await BuscarProducto({nombre:'arroz'});

    await dbDisconnect();
}

main()

export default main;
