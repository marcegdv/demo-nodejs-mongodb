import { config as dotenvConfig } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenvConfig();

export const mdbStatus = {
    client: {}, //atlas o mongod
    isAtlas: false,
    isLocal: false,
    database: '',
    collection: '',
    connection: {
        url: '',
        status: false,
        date: {},
        persist: false,
        autodisconnect: 0, //in seconds
        timeout: null, //the function when timeout
    },
    last: {
        error: {},
        database: '',
        collection: '',
        action: '',
    },
};

//-------------------------------------------------------------------------------[ Connect ] -----
export const dbConnect = async () => {
    try {
        await mdbClient().connect();
        mdbUpdateConnect();
    }
    catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

//-------------------------------------------------------------------------------[ Disconnect ] -----
export const dbDisconnect = async () => {
    try {
        await mdbClient().close();
        mdbUpdateDisconnect();
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

//-------------------------------------------------------------------------------[ Create ] -----
export const dbCreate = async (collection, document) => {
    if (!Array.isArray(document)) { document = [document] }
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).insertMany(document);
        mdbUpdateLastAccess(mdbName(), collection, 'insertMany');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbCreateOne = async (collection, document) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).insertOne(document);
        mdbUpdateLastAccess(mdbName(), collection, 'insertOne');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbCreateById = async (collection, mdbObjectId, document) => {
    document._id = mdbObjectId;
    return await dbCreateOne(collection, document);
}

//-------------------------------------------------------------------------------[ Read ] -----
export const dbRead = async (collection, criteria) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).find(criteria).toArray();
        mdbUpdateLastAccess(mdbName(), collection, 'find');
        return result;
    }
    catch {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbReadOne = async (collection, criteria) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).findOne(criteria);
        mdbUpdateLastAccess(mdbName(), collection, 'findOne');
        return result;
    }
    catch {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbReadById = async (collection, mdbObjectId) => {
    return await dbReadOne(collection, { _id: ObjectId(mdbObjectId) });
}

export const dbCollections = async () => {
    try {
        const result = await mdbClient().db(mdbName()).listCollections().toArray();
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbShowCollections = async () => {
    let collections = await dbCollections();
    let result = [];
    collections.forEach(collection => {
        result.push(collection.name);
    });
    return result;
}

//-------------------------------------------------------------------------------[ Update ] -----
export const dbUpdate = async (collection, criteria, update, options) => {
    try {
        const dbCollection = mdbClient().db(mdbName()).collection(collection);
        let result = null
        if (options) {
            result = await dbCollection.updateMany(criteria, update, options);
        } else {
            result = await dbCollection.updateMany(criteria, update);
        }
        mdbUpdateLastAccess(mdbName(), collection, 'updateMany');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbUpdateOne = async (collection, criteria, update, options) => {
    try {
        const dbCollection = mdbClient().db(mdbName()).collection(collection);
        let result = null
        if (options) {
            result = await dbCollection.updateOne(criteria, update, options);
        } else {
            result = await dbCollection.updateOne(criteria, update);
        }
        mdbUpdateLastAccess(mdbName(), collection, 'updateOne');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbUpdateById = async (collection, mdbObjectId, update, options) => {
    return await dbUpdateOne(collection, { _id: ObjectId(mdbObjectId) }, update, options);
}

//-------------------------------------------------------------------------------[ Delete ] -----
export const dbDelete = async (collection, criteria) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).deleteMany(criteria);
        mdbUpdateLastAccess(mdbName(), collection, 'deleteMany');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbDeleteOne = async (collection, criteria) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).deleteOne(criteria);
        mdbUpdateLastAccess(mdbName(), collection, 'deleteOne');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbDeleteById = async (collection, mdbObjectId) => {
    return await dbDeleteOne(collection, { _id: ObjectId(mdbObjectId) });
}

export const dbClearCollection = async (collection) => {
    try {
        const result = await dbDelete(collection, {});
        mdbUpdateLastAccess(mdbName(), collection, 'clearCollection');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbDropCollection = async (collection) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).drop();
        mdbUpdateLastAccess(mdbName(), collection, 'dropCollection');
        return result;
    } catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

export const dbDrop = async (database) => {
    try {
        const result = await mdbClient().db(database).dropDatabase();
        mdbStatus.last.database = database;
        mdbStatus.last.action = 'dropDatabase';
        mdbStatus.database = '';
        return result;
    }
    catch (error) {
        mdbUpdateErrorAndThrowIt(error, true);
    }
}

//-------------------------------------------------------------------------------[ Utilities ] -----
const mdbUpdateConnect = () => {
    mdbStatus.connection.status = true;
    mdbStatus.connection.date = Date.now();
    mdbStatus.database = mdbName();
    mdbStatus.last.action = 'connected';
    mdbUpdateTimeOut();
}

const mdbUpdateDisconnect = () => {
    mdbClearTimeout();
    mdbStatus.connection.status = false;
    mdbStatus.last.action = 'disconnected';
}

const mdbUpdateTimeOut = () => {
    if (mdbAutoDisconnectTimeOut() > 0) {
        mdbClearTimeout();
        mdbStatus.connection.timeout = setTimeout(
            dbDisconnect,
            mdbAutoDisconnectTimeOut(mdbStatus.connection.autodisconnect)
        );
    }
}

const mdbAutoDisconnectTimeOut = (seconds) => {
    let miliseconds = mdbStatus.connection.autodisconnect;
    if (seconds > 0) {
        miliseconds = seconds * 1000;
    }
    mdbStatus.connection.autodisconnect = miliseconds;
    return mdbStatus.connection.autodisconnect;
}

const mdbClearTimeout = () => {
    if (mdbStatus.connection.timeout) {
        clearTimeout(mdbStatus.connection.timeout);
    }
    mdbStatus.connection.timeout = null;
}


const mdbUpdateLastAccess = (database, collection, action) => {
    mdbStatus.last.database = database;
    mdbStatus.last.collection = collection;
    mdbStatus.last.action = action;
}
const mdbUpdateErrorAndThrowIt = (error, doThrow) => {
    mdbStatus.last.error = error;
    if (doThrow) { throw error };
}

const mdbConnected = () => {
    return mdbStatus.connection.status;
}

const mdbPersist = () => {
    return mdbStatus.connection.persist;
}

const mdbName = (name) => {
    if (name && (typeof name === 'string')) {
        mdbSetName(name);
    }
    return mdbStatus.database;
}
const mdbSetName = (databaseName) => {
    mdbStatus.database = databaseName;
}

const mdbCollection = (name) => {
    if (name && (typeof name === 'string')) {
        mdbSetCollection(name);
    }
    return mdbStatus.collection;
}
const mdbSetCollection = (collection) => {
    mdbStatus.collection = collection;
}

const mdbClient = (client) => {
    if (client && (client instanceof MongoClient)) {
        mdbStatus.client = client
    }
    return mdbStatus.client;
}

const mdbIsAtlas = () => {
    return mdbStatus.isAtlas;
}

const mdbIsLocal = () => {
    return mdbStatus.isLocal;
}

const mdbStatusClear = () => {
    mdbStatus.client = null;
    mdbStatus.isAtlas = false;
    mdbStatus.isLocal = false;
    mdbStatus.database = '';
    mdbStatus.collection = '';
    mdbStatus.connection.url = '';
    mdbStatus.connection.status = false;
    mdbStatus.connection.date = null;
    mdbStatus.connection.persist = false;
    mdbStatus.connection.autodisconnect = 0;
    mdbStatus.connection.timeout = null;
    mdbStatus.last.error = null;
    mdbStatus.last.database = '';
    mdbStatus.last.collection = '';
    mdbStatus.last.action = '';
}

export const mdbSetAtlasEnvironmentConfig = () => {
    mdbStatusClear();
    const mdbUser = process.env.DB_USER_NAME;
    const mdbPass = process.env.DB_USER_PASSWORD;
    const mdbCluster = process.env.DB_CLUSTER_NAME;
    const mdbClusterUrl = process.env.DB_CLUSTER_URL;
    const mdbDbName = process.env.DB_NAME;
    const mdbOptions = process.env.DB_OPTIONS;
    const mdbUrl = 'mongodb+srv://' + mdbUser + ':' + mdbPass + '@' + mdbCluster + '.' + mdbClusterUrl + '/' + mdbDbName + '?' + mdbOptions;
    mdbStatus.client = new MongoClient(mdbUrl);
    mdbStatus.isAtlas = true;
    mdbStatus.database = '';
    mdbStatus.collection = '';
    mdbStatus.connection.url = mdbUrl;
}
export const mdbSetLocalDefaultConfig = () => {
    mdbStatusClear();
    const mdbUrl = 'mongodb://127.0.0.1:27017';
    mdbStatus.client = new MongoClient(mdbUrl);;
    mdbStatus.isAtlas = false;
    mdbStatus.database = '';
    mdbStatus.collection = '';
    mdbStatus.connection.url = mdbUrl;
}

export const dbAccess = async (crud, collection, param1, param2, param3) => {
    const doDisconnect = async () => {
        if (!mdbPersist()) {
            await dbDisconnect();
        }
    }

    let result = null;

    try {
        if (!mdbConnected()) {
            await dbConnect();
        }
        if (!collection) {
            if (!mdbCollection()) {
                throw new Error('No se especificó una colección.');
            } else {
                collection = mdbCollection();
            }
        }
        crud = crud.toLowerCase();
        switch (crud) {
            case 'c':
            case "create":
                result = await dbCreate(collection, param1);
                break;
            case 'r':
            case "read":
                result = await dbRead(collection, param1);
                break;
            case 'u':
            case "update":
                result = await dbUpdate(collection, param1, param2, param3);
                break;
            case 'd':
            case "delete":
                result = await dbDelete(collection, param1);
                break;
            case 'cid':
                result = await dbCreateById(collection, param1, param2);
                break;
            case 'rid':
                result = await dbReadById(collection, param1);
                break;
            case 'uid':
                result = await dbUpdateById(collection, param1, param2, param3);
                break;
            case 'did':
                result = await dbDeleteById(collection, param1);
                break;
            default:
                console.log('Operation', crud, 'not supported!');
                break;
        }
        await doDisconnect();
        return result;
    }
    catch (error) {
        await doDisconnect();
        throw error;
    }
}

const test = async () => {
    //-----[ Usar configuración de archivo .env para conectar con Atlas, o con una db local ]-----
    const usarConfigAtlas = true;
    //-----
    usarConfigAtlas ? mdbSetAtlasEnvironmentConfig() : mdbSetLocalDefaultConfig();
    //---------------------------------------------------------

    try {
        const collection = 'test';
        const product = {
            nombre: 'Taza',
            precio: 33,
            stock: 14,
        };
        let result = null;
        console.log('Iniciando test...\nConectando con ' + (mdbIsAtlas() ? 'MongoDB Atlas' : 'MongoDB Server') + '...');
        await dbConnect();
        console.log('Conexión establecida.');
        console.log('Colecciones en la DB:\n  [' + await dbShowCollections() + ']');
        console.log('Insertando producto:\n  ' + JSON.stringify(product));
        result = await dbCreateOne(collection, product);
        console.log('Resultado de la inserción:\n  ' + JSON.stringify(result));
        console.log('Colecciones en la DB:\n  [' + await dbShowCollections() + ']');
        let id = result.insertedId;
        console.log('Buscando producto insertado (\"_id\":\"' + id + '\")');
        result = await dbReadById(collection, id);
        console.log('  ' + JSON.stringify(result));
        console.log('Modificando producto encontrado...');
        result = await dbUpdateById(collection, result._id, { $set: { descripcion: 'Lámpara' } });
        console.log('Resultado de la modificación:\n  ' + JSON.stringify(result));
        result = await dbReadById(collection, id);
        console.log('Producto:');
        console.log('  ' + JSON.stringify(result));
        console.log('Eliminando el producto modificado (\"_id\":\"' + result._id + '\")');
        result = await dbDeleteById(collection, result._id);
        console.log('Resultado de la eliminación:\n  ' + JSON.stringify(result));
        console.log('Buscando producto eliminado (\"_id\":\"' + id + '\")');
        result = await dbReadById(collection, id);
        console.log('Resultado de la búsqueda (debería ser null): ' + JSON.stringify(result));
        console.log('Colecciones en la DB:\n  [' + await dbShowCollections() + ']');
        console.log('Elimnando la colección \"test\"...');
        dbDropCollection(collection);
        console.log('Colecciones en la DB:\n  [' + await dbShowCollections() + ']');
        console.log('Fin del test.');
    } catch (error) {
        console.log('Error:\n', error);
    }
    console.log('Desconectando...');
    await dbDisconnect();
    console.log('Desconexión completa.');
}
//test();
