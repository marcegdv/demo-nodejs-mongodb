export const logResponse = (collection, documents) => {
    const respuesta = collection.toString() + ': +' + JSON.stringify(documents);
    console.log('DB response:',documents);
    return respuesta;
}