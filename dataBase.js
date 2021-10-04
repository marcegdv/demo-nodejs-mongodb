import { config as dotenvConfig } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenvConfig();

const mdbUser = process.env.DB_USER_NAME;
const mdbPass = process.env.DB_USER_PASSWORD;
const mdbCluster = process.env.DB_CLUSTER_NAME;
const mdbClusterUrl = process.env.DB_CLUSTER_URL;
const mdbDbName = process.env.DB_NAME;
const mdbOptions = process.env.DB_OPTIONS;
const mdbUrl = 'mongodb+srv://' + mdbUser + ':' + mdbPass + '@' + mdbCluster + '.' + mdbClusterUrl + '/' + mdbDbName + '?' + mdbOptions;
const atlas = new MongoClient(mdbUrl);

const mdbLocal = 'mongodb://127.0.0.1:27017';
const local = new MongoClient(mdbLocal);

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
mdbSetAtlas();

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
    return await dbRead(collection, { _id: ObjectId(mdbObjectId) });
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

const mdbClearTimeout =() => {
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
        throw (error);
    }
    return result;
}

const mdbSetAtlas = () => {
    mdbStatus.client = atlas;
    mdbStatus.isAtlas = true;
    mdbStatus.database = 'mercado';
    mdbStatus.connection.url = mdbUrl;
}
const mdbSetLocal = () => {
    mdbStatus.client = local;
    mdbStatus.isAtlas = false;
    mdbStatus.database = 'unaDataBase';
    mdbStatus.connection.url = mdbLocal;
}
/*
const main = async () => {
    const usarAtlas = true;
    let collection = null;
    if (!usarAtlas) {
        mdbSetAtlas();
        collection = 'productos';
    } else {
        mdbSetLocal();
        collection = 'inventory';
    }
    try {
        console.log('Conectando con', mdbLocal);
        await dbConnect();
        console.log('Conexión exitosa.');
    }
    catch (error) {
        console.log('Conexión fallida:\n', error);
        return;
    }
    try {
        const result = await dbRead(collection,{});
        console.log('Inventori:\n',result);
    }
    catch (error) {
        console.log('Error al leer:\n', error);
        return;
    }
    try {
        console.log('Desconectando de',mdbLocal)
        await dbDisconnect();
        return;
    } catch (error) {
        console.log('Desconexión fallida:\n', error);
        return;
    }
}
main();
*/