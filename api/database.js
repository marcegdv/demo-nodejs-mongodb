import { config as dotenvConfig } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenvConfig();

export const mdbStatus = {
    client: {}, //atlas o mongo
    isAtlas: false,
    isLocal: false,
    database: '',
    connection: {
        url: '',
        status: false,
        date: {},
        persist: false,
        idleAutodisconnect: 0, //in seconds
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
        mdbUpdateLastError(error, true);
    }
}

//-------------------------------------------------------------------------------[ Disconnect ] -----
export const dbDisconnect = async () => {
    try {
        await mdbClient().close();
        mdbUpdateDisconnect();
    } catch (error) {
        mdbUpdateLastError(error, true);
    }
}

//-------------------------------------------------------------------------------[ Create ] -----
export const dbCreate = async (collection, document) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).insertMany(document);
        mdbUpdateLast(mdbName(), collection, 'insertMany');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
    }
}

export const dbCreateOne = async (collection, document) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).insertOne(document);
        mdbUpdateLast(mdbName(), collection, 'insertOne');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
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
        mdbUpdateLast(mdbName(), collection, 'find');
        return result;
    }
    catch {
        mdbUpdateLastError(error, true);
    }
}

export const dbReadOne = async (collection, criteria) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).findOne(criteria);
        mdbUpdateLast(mdbName(), collection, 'findOne');
        return result;
    }
    catch {
        mdbUpdateLastError(error, true);
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
        mdbUpdateLastError(error, true);
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
        mdbUpdateLast(mdbName(), collection, 'updateMany');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
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
        mdbUpdateLast(mdbName(), collection, 'updateOne');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
    }
}

export const dbUpdateById = async (collection, mdbObjectId, update, options) => {
    return await dbUpdateOne(collection, { _id: ObjectId(mdbObjectId) }, update, options);
}

//-------------------------------------------------------------------------------[ Delete ] -----
export const dbDelete = async (collection, criteria) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).deleteMany(criteria);
        mdbUpdateLast(mdbName(), collection, 'deleteMany');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
    }
}

export const dbDeleteOne = async (collection, criteria) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).deleteOne(criteria);
        mdbUpdateLast(mdbName(), collection, 'deleteOne');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
    }
}

export const dbDeleteById = async (collection, mdbObjectId) => {
    return await dbDeleteOne(collection, { _id: ObjectId(mdbObjectId) });
}

export const dbClearCollection = async (collection) => {
    try {
        const result = await dbDelete(collection, {});
        mdbUpdateLast(mdbName(), collection, 'clearCollection');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
    }
}

export const dbDropCollection = async (collection) => {
    try {
        const result = await mdbClient().db(mdbName()).collection(collection).drop();
        mdbUpdateLast(mdbName(), collection, 'dropCollection');
        return result;
    } catch (error) {
        mdbUpdateLastError(error, true);
    }
}

const dbDrop = async (database) => {
    try {
        const result = await mdbClient().db(database).dropDatabase();
        mdbStatus.last.database = database;
        mdbStatus.last.action = 'dropDatabase';
        mdbStatus.database = '';
        return result;
    }
    catch (error) {
        mdbUpdateLastError(error, true);
    }
}

//-------------------------------------------------------------------------------[ Utilities ] -----
const mdbUpdateTimeout = () => {
    if (mdbStatus.connection.idleAutodisconnect) {
        mdbClearTimeout();
        mdbStatus.connection.timeout = setTimeout(dbDisconnect, mdbStatus.connection.idleAutodisconnect * 1000);
    }
}

const mdbClearTimeout = () => {
    if (mdbStatus.connection.timeout) {
        clearTimeout(mdbStatus.connection.timeout);
        mdbStatus.connection.timeout = null;
    }
}

const mdbUpdateConnect = () => {
    mdbStatus.connection.status = true;
    mdbStatus.connection.date = Date.now();
    mdbUpdateTimeout();
    mdbStatus.database = mdbName();
    mdbStatus.last.action = 'connect';
}

const mdbUpdateDisconnect = () => {
    mdbStatus.connection.status = false;
    mdbClearTimeout();
    mdbStatus.last.action = 'disconnect';
}

const mdbUpdateLast = (database, collection, action) => {
    mdbStatus.last.database = database;
    mdbStatus.last.collection = collection;
    mdbStatus.last.action = action;
}
const mdbUpdateLastError = (error, doThrow) => {
    mdbStatus.last.error = error;
    if (doThrow) { throw error };
}

const mdbConnected = () => {
    return mdbStatus.connection.status;
}

const mdbPersist = () => {
    return mdbStatus.connection.persist;
}

const mdbName = () => {
    return mdbStatus.database;
}

const mdbClient = () => {
    return mdbStatus.client;
}

const mdbIsAtlas = () => {
    return mdbStatus.isAtlas;
}

const mdbIsLocal = () => {
    return mdbStatus.isLocal;
}

const mdbSetAtlas = () => {
    const mdbUser = process.env.DB_USER_NAME;
    const mdbPass = process.env.DB_USER_PASSWORD;
    const mdbCluster = process.env.DB_CLUSTER_NAME;
    const mdbClusterUrl = process.env.DB_CLUSTER_URL;
    const mdbDbName = process.env.DB_NAME;
    const mdbOptions = process.env.DB_OPTIONS;
    const mdbUrl = 'mongodb+srv://' + mdbUser + ':' + mdbPass + '@' + mdbCluster + '.' + mdbClusterUrl + '/' + mdbDbName + '?' + mdbOptions;
    const atlas = new MongoClient(mdbUrl);
    mdbStatus.client = atlas;
    mdbStatus.isAtlas = true;
    mdbStatus.database = 'mercado';
    mdbStatus.connection.url = mdbUrl;
}
const mdbSetLocal = () => {
    const mdbUrl = 'mongodb://127.0.0.1:27017';
    const local = new MongoClient(mdbUrl);
    mdbStatus.client = local;
    mdbStatus.isAtlas = false;
    mdbStatus.database = 'unaDataBase';
    mdbStatus.connection.url = mdbUrl;
}

export const dbAccess = async (crud, collection, param1, param2, param3) => {
    let result = null;
    try {
        if (!mdbConnected()) {
            await dbConnect();
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
        if (!mdbPersist()) {
            await dbDisconnect();
        }
    }
    catch (error) {
        throw error;
    }
    return result;
}


//----- [ Test configs ] -----
const test = async () => {
    mdbSetAtlas();
    //mdbSetLocal();
    try {
        const collection = 'test';
        const product = {
            nombre: 'Taza',
            precio: 33,
            stock: 14,
        };
        let result = null;
        console.log('Iniciando test...\nConectando con ' + (mdbIsAtlas()?'MongoDB Atlas':'MongoDB Server') + '...');
        await dbConnect();
        console.log('Conexión establecida.');
        console.log('Colecciones en la DB:\n  ['+await dbShowCollections()+']');
        console.log('Insertando producto:\n  '+JSON.stringify(product));
        result = await dbCreateOne(collection,product);
        console.log('Resultado de la inserción:\n  '+JSON.stringify(result));
        console.log('Colecciones en la DB:\n  ['+await dbShowCollections()+']');
        let id = result.insertedId;
        console.log('Buscando producto insertado (\"_id\":\"'+id+'\")');
        result = await dbReadById(collection,id);
        console.log('  '+JSON.stringify(result));
        console.log('Modificando producto encontrado...');
        result = await dbUpdateById(collection,result._id,{$set: {descripcion:'Lámpara'}});
        console.log('Resultado de la modificación:\n  '+JSON.stringify(result));
        result = await dbReadById(collection,id);
        console.log('Producto:');
        console.log('  '+JSON.stringify(result));
        console.log('Eliminando el producto modificado (\"_id\":\"'+result._id+'\")');
        result = await dbDeleteById(collection,result._id);
        console.log('Resultado de la eliminación:\n  '+JSON.stringify(result));
        console.log('Buscando producto eliminado (\"_id\":\"'+id+'\")');
        result = await dbReadById(collection,id);
        console.log('Resultado de la búsqueda (debería ser null): '+JSON.stringify(result));
        console.log('Colecciones en la DB:\n  ['+await dbShowCollections()+']');
        console.log('Elimnando la colección \"test\"...');
        dbDropCollection(collection);
        console.log('Colecciones en la DB:\n  ['+await dbShowCollections()+']');
        console.log('Fin del test.');
    } catch (error) {
        console.log('Error:\n', error);
    }
    console.log('Desconectando...');
    await dbDisconnect();
    console.log('Desconexión completa.');
}
test();