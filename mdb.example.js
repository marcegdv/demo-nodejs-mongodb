import { config as dotenvConfig} from 'dotenv';
import { MongoClient } from 'mongodb';

dotenvConfig();

//Database user
const mdbUser = process.env.DB_USER_NAME;
//Database user password
const mdbPass = process.env.DB_USER_PASSWORD;
//Database Atlas cluster
const mdbCluster = process.env.DB_CLUSTER_NAME;
//Database Atlas Cluster url
const mdbClusterUrl = process.env.DB_CLUSTER_URL;
//Database Name
const mdbName = process.env.DB_NAME;
//Database Atlas connection options
const mdbOptions = process.env.DB_OPTIONS;
//Connection URL
const url = 'mongodb+srv://' + mdbUser + ':' + mdbPass + '@' + mdbCluster + '.' + mdbClusterUrl + '/' + mdbName + '?' + mdbOptions;
//Client for MongoDB Atlas server
const atlas = new MongoClient(url);

//-------------------------------------------------------------------------------[ Connect ] -----
export const dbConnect = async () => {
    console.log('Connecting to MongoDB Atlas server...');
    try {
        await atlas.connect();
        console.log('Connected successfully to MongoDB Atlas.');
    } catch (error) {
        //if (error instanceof MongoServerError) {}
        console.log('Error:\n', error);
        throw error;
    }
}

//-------------------------------------------------------------------------------[ Disconnect ] -----
export const dbDisconnect = async () => {
    console.log('Closing connection to MongoDB Atlas...');
    try {
        await atlas.close();
        console.log('Connection closed.');
    } catch (error) {
        console.log('Error:\n', error);
        throw error;
    }
}

//-------------------------------------------------------------------------------[ Create ] -----
export const dbCreate = async (collection, document) => {
    if (typeof document === 'string') { document = JSON.parse(document); }
    if (!Array.isArray(document)) { document = [ document ]; }
    console.log('Inserting...', document);
    try {
        const dbCollection = atlas.db(mdbName).collection(collection);
        const result = await dbCollection.insertMany(document);
        console.log('Document/s inserted!', result);
        return result;
    } catch (error) {
        console.log('Error:\n', error);
        throw error;
    }
}

export const dbCreateOne = async (collection, document) => {
    if (typeof document === 'string') { document = JSON.parse(document); }
    console.log('Inserting...', document);
    try {
        const dbCollection = atlas.db(mdbName).collection(collection);
        const result = await dbCollection.insertMany(document);
        console.log('Document/s inserted!', result);
        return result;
    } catch (error) {
        console.log('Error:\n', error);
        throw error;
    }
}

//-------------------------------------------------------------------------------[ Read ] -----
export const dbRead = async (collection, criteria) => {
    if (typeof criteria === 'string') { criteria = JSON.parse(documento); }
    console.log('Seraching documents, criteria:', criteria);
    try {
        const dbCollection = atlas.db(mdbName).collection(collection);
        const result = await dbCollection.find(criteria).toArray();
        console.log('Finded documents, ' + result.length + ':\n', result);
        return result;
    } catch (error) {
        console.log('Error:\n', error);
        throw error;
    }
}

export const dbReadOne = async (collection, criteria) => {
    if (typeof criteria === 'string') { criteria = JSON.parse(documento); }
    console.log('Searching one document, criteria:', criteria);
    try {
        const dbCollection = atlas.db(mdbName).collection(collection);
        const result = await dbCollection.findOne(criteria);
        console.log('Finded document:\n', result);
        return result;
    } catch (error) {
        console.log('Error:\n', error);
        throw error;
    }
}

//-------------------------------------------------------------------------------[ Update ] -----
export const dbUpdate = async (collection, criteria, options) => {
    if (typeof criteria === 'string') { criteria = JSON.parse(documento); }
    if (typeof options === 'string') {
        console.log('Atributes must be an object.');
        return new Error('Atributes must be an object.');
    }
    console.log('Updating documents, criteria:', criteria);
    try {
        const dbCollection = atlas.db(mdbName).collection(collection);
        const result = await dbCollection.updateMany(criteria, options);
        console.log('Update result:\n', result);
        return result;
    } catch (error) {
        console.log('Error:\n', error);
        throw error;
    }
}

//-------------------------------------------------------------------------------[ Delete ] -----
export const dbDelete = async (collection, criteria) => {
    if (typeof criteria === 'string') { criteria = JSON.parse(documento); }
    console.log('Deleting documents, criteria:', criteria);
    try {
        const dbCollection = atlas.db(mdbName).collection(collection);
        const result = await dbCollection.deleteMany(criteria);
        console.log('Delete result:\n', result);
        return result;
    } catch (error) {
        console.log('Error:\n', error);
        throw error;
    }
}

export const dbClearCollection = async (collection) => {
    const errMsg = isWrongName(collection);
    if (errMsg) { throw new Error(errMsg); }
    try {
        const result = await dbDelete(collection,{});
        return result;
    } catch {
        console.log('Error:\n', error);
        throw error;
    }
}

export const dbDropCollection = async (collection) => {
    const errMsg = isWrongName(collection);
    if (errMsg) { throw new Error(errMsg); }
    try {
        const dbCollection = atlas.db(mdbName).collection(collection);
        const result = await dbCollection.drop();
        console.log('Collection "' + collection + '" droped.\n',result);
        return result;
    } catch {
        console.log('Error:\n', error);
        throw error;
    }
}

//-------------------------------------------------------------------------------[ Utilities ] -----
const isWrongName = (name) => {
    let errMsg = '';
    if (!name) {
        errMsg = 'A collection name must be specified.';
    } else {
        if (typeof name !== 'string') { errMsg = 'A collection name must be a string.'; }
        if (name.length < 1) { errMsg = 'A collection name must be not empty.'; }
    }
    return errMsg;
}

//===============================================================================[ MAIN ] =====
async function agregarProducto(producto) {
    return await dbCreate('productos', producto);
}
async function buscarProducto(criterio) {
    return await dbRead('productos', criterio);
}
async function actualizarProducto (criterio, atributos) {
    await dbUpdate('productos', criterio, atributos);
}
async function eliminarProducto(criterio) {
    return await dbDelete('productos', criterio);
}

async function main() {

    
    const producto1 = { tipo: 'alimento', nombre: 'arroz', cantidad: 500, udm: 'gramos', precio: 50, stock: 23 };
    const producto2 = { tipo: 'bebida', nombre: 'soda', cantidad: 1.5, udm: 'litros', precio: 20, stock: 40 };
    const lista = [producto1, producto2];
    
    await dbConnect();
    
    await agregarProducto(lista);
    //await agregarProducto('{"tipo":"limpieza"}');
    //await agregarProducto('[{"tipo":"alimento","nombre":"carne"},{"tipo":"bebida","nombre":"vino"}]');
    await dbClearCollection('productos');

    await dbDropCollection('productos');
    
    //await buscarProducto({});
    //await buscarProducto({tipo:'alimento'});

    //await eliminarProducto({tipo:'bebida'});

    //await buscarProducto({nombre:'arroz'});
    //await actualizarProducto([{nombre:'arroz'}], '{$set: {marca:"Marolio"}}');
    //await buscarProducto({nombre:'arroz'});

    await dbDisconnect();
}

main();
