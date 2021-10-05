MongoDB - Conceptos básicos
---------------------------

Es una base de datos del tipo NOSQL (not only SQL) por lo que los datos que almacena no tienen que cumplir un esquema predefinido.
¿Por qué utilizar MongoDB?
Aunque MongoDB es multipropósito, esta orientada a poder leer/crear datos masivamente, y es ideal para minería de datos, redes sociales, juegos, ciencia de datos, y todo tipo de aplicaciones que generen/consuman datos rápidamente. Ademas es escalable horizontalmente.

Características principales:
* es multiplataforma
* open source
* puedes tener tu DB en la nube que ofrece (Atlas) o localmente (servicio y consola)
* los datos utilizan la estructura JSON y se guardan en formato BSON (el formato binario de JSON)
* cada dato que guardemos se denomina Documento (es como un registro o renglón de una tabla SQL)
* un conjunto de Documentos conforman una Colección (es como una tabla en SQL)
* intrepreta JavaScript

Ventajas:
* No hay esquemas para los datos: por lo que un Documento puede tener una estructura diferente a otro Documento que se encuentre en la misma colección, incluso pueden tener atributos distintos.
* Lecturas y escrituras masivas mas rápida que SQL: al leer o escribir un Documento, este se almacena en sola colección, a diferencia de las bases de datos relacionales, no tiene que acceder a distintas tablas (bases de datos normalizadas) para poder guardar un dato, y a gran escala, la lectura/creación en las SQL pierde performance.
* Escalabilidad horizontal: cuando la DB requiera mas capacidad, con solo agregar una computadora ya es necesario, la base de datos puede estar distribuida en varias computadoras y funcionar sin mayores configuraciones o expansiones de hardware, por lo que este tipo de escalabilidad horizontal es mucho menos costosa que tener que escalar verticalmente (mejorar la computadora donde tenemos nuestra base de datos es mas costoso económicamente, y muchas veces no es posible mejorarla).

Desventajas:
* Datos duplicados: al tener Documentos sin un esquema definido, lo mas práctico (y para explotar las ventajas de MongoDB) es duplicar algunos datos. Esto no ocurre en las bases de datos relacionales que está normalizadas.
* Relaciones a cargo del programador: al no ser una DB relacional, realizar consultas complejas relacionando distintas colecciones puede caer en manos del desarrollador de la aplicación.
* Múltiples updates pueden ser costosos: como vimos, la ventaja es la lectura/creación de datos, pero al realizar actualizaciones de forma masiva se verá una pérdida en la performance (lo opuesto que en las DB relacionales).

JSON y BSON:
Al momento de leer/crear un dato en nuestra MongoDB, le pasamos los datos en formato de JSON, y también lo recibiremos en JSON cuando hagamos una consulta. Pero al ser un formato en el que los datos se representan con texto legible para humanos, hace que la computadora pierda performance al momento de procesarlos (ej: no hay tipos de datos), por lo que internamente MongoDB manipula esos mismos datos en formato BSON, el formato binario de JSON, ganando asi una mejor performance.

Documentos:
Este es el término que MongoDB utiliza para denominar a lo que sería un registro en una tabla de una DB relacional. Como vimos, estos pueden contener distinta estructura y atributos con respecto a otros documentos de su mismo tipo. Supongamos los siguientes Documentos de dos usuarios válidos en una misma colección:
Usuario 1:
{
    "nombre": "Juan",
    "email": "juan@email.com",
    "ciudad": "Buenos Aires",
    "fechaNacimiento": new Date("20/1/2021"),
    "ban": false
}

Usuario 2:
{
    "user": "perez",
    "pass": "12345Seis",
    "permisos": [ "leer", "escribir" ],
    "datos": {
        "nombre": "Maria",
        "apellido": "Perez",
        "email": "maria.perez@email.com",
        "telefono": "1234567890"
    }
}

Como se vio en el primer ejemplo de un usuario, MongoDB interpreta funciones de JavaScript.

Colecciones:
MongoDB guarda los Documentos en Colecciones. Es ahí donde se realizaran las creaciones de usuarios, lectura, actualización y eliminación de los mismos. Como ya vimos, los Documentos no tienen un esquema definido que cumplir, de hecho, podríamos tener mas de una vez el mismo Documento, y sin un identificador único. Por esto, MongoDB asigna un identificador único a cada Documento que agreguemos a la colección con la clave _id: <número_hexa_12_dígitos> para que podamos tener algo similar a una clave primaria para cada Documento de la Coleccion. Este número hexadecimal de 12 dígitos tiene la siguiente estructura:
4 bytes = current timestamp (fecha y hora en la que se creo el Documento dentro de la colección).
3 bytes = machine id (un ID de la computadora que esta corriendo MongoDB).
2 bytes = process id of mongodb server (el ID del procedo de mongod).
3 bytes = an incremental value (un número que se incrementa con cada insercción).
De esta forma asegura que cada Documento tenga un identificador único.

MongoDB - Atlas - Tu base de datos en la nube ☁️ 
---------------------------------------------

¿No tenes un buen hardware o host donde instalar tu MongoDB? ¡No importa! MongoDB Atlas es la solución que nos ofrece MongoDB para que te desligues un poco de instalar y administrar algunas tareas al momento de tener tu base de datos, ¡y en la nube!
Por el momento, dirigiéndote a la página oficial de MongoDB, sólo tienes que entrar a la sección referida a Atlas para acceder a este servicio que tiene una opción gratis. Claro que te pedirá que te registres, completando unos pocos datos, y que confirmes a través del e-mail que hayas indicado. Luego puedes acceder al plan Free el cual ofrece recursos reducidos que son suficientes para dar los primeros pasos y aprender cómo utilizar tu primer cluster, con 512Mb de espacio para almacenar datos (y otros límites como cantidad de conexiones, bases de datos, colecciones).
Una vez que tienes acceso mediante MongoDB Atlas a tu cluster, desde ahí se puedes configurar los accesos, según una o varias ip, usuarios, BBDD, etc.
Luego de crear una BBDD y un usuario, ya puedes realizar una conexión remotamente al tu cluster. Y para conectarte a tu cluster, haz click sobre el botón Connect y te pedirá que elijas la forma de conectarte: por Línea de comandos(consola), con tu app (elige la versión del lenguaje de tu app) o con MongoDB Compass (interfaz gráfica multiplataforma), y te brindará la cadena de conexión necesaria para lograrlo.

Por ejemplo, para conectar a tu cluster utilizando la consola de MongoDB en una terminal o consola de línea de comandos en tu sistema operativo, copia desde la web de MongoDB Atlas el comando de conexión que te brindó y pegalo en la consola. (Deberás tener instalada la consola de MongoDB). Ejemplo de línea de comando:
mongo "mongodb+srv://cluster0.oenzu.mongodb.net/mercadodb" --username usuarioAdmin
(o reemplazas mercadoDB por la BBDD que vas a utilizar y usuarioAdmin por el usuario que hayas creado).
Te pedirá que ingreses la password asociada al usuario para acceder (similar al logeo por consola de mysql).

Ya que el cluster esta funcionando y la consola de MongoDB se conectó, veamos algunos comandos:
help: Muestra una breve descripción de los comandos disponibles.

Principales comandos para ver y posicionarnos en la base de datos correcta:
show dbs: Muestra las bases de datos existentes.
use <database_name>: Cambia/Crea una base de datos según el nombre indicado para utilizar.
db: Muestra la base de datos que actualmente se esta utilizando.
show collections: Muestra las colecciones creadas en la base de datos actual.

Principales comandos para realizar operaciones CRUD (Create/Read/Update/Delete):

* Crear/Insertar (Create)

db.unaColeccion.insert({"clave":"valor", ...}): Inserta en la colección unaColeccion un documento. Si la colección no existe, crea la colección e inserta el documento. Recordemos que MongoDB agrega una clave "_id" con una valor único para cada documento que insertemos, a menos que especifiquemos esa clave y le asignemos un valor, perdiendo cierta integridad en los datos que agrega autmáticamente MongoDB. O bien, podríamos programar nuestro propio identificador único para cada documento que insertemos.
Hay variantes con respecto a este método de inserción, ya que insert() puede insertar un documento o un array de documentos, y dependiendo de esta condición, el documento que retorna el estado de la inserción puede tener diferente estructura, por lo que los siguientes comandos aseguran la misma estructura en el documento de retorno:
insertMany([{}, {}, ..., {}]) que inserta un array de documentos, e insertOne({}) inserta un solo documento.
Como vimos, estos tres métodos retornan un documento indicando el resultado de la operación. Un documento de tipo WriteResult si se inserto un solo documento, o de tipo BulkWriteResult si se insertaron varios documentos. Por lo que insertOne() retorna siempre un documento WriteResult e insertMany() un documento BulkWriteResult.

Nota: Insertar o crear un nuevo atributo para un documento se realiza con el método update(). 

* Leer (Read)

db.unaColeccion.find(<filtro>[, <proyeccion>]): Buscar en la colección unaColeccion los documentos que coincidan con lo indicado en <filtro>. Si no se indica un filtrado, retornará todo el contenido de la colección, ejemplo: db.prductos.find(). Y el parámetro opcional <proyeccion> indica que atributos mostraremos de los documentos encontrados. Supongamos que realizamos la siguiente búsqueda en la colección productos de documentos que son de tipo bebidas que tienen los atributos: tipo, nombre, contenido y otros mas con el siguiente comando: db.productos.find({"tipo": "bebidas"}, "nombre": 1, "_id": 0), nos retornará todos los documentos de tipo bebida pero mostrando sólo el atributo nombre y ocultando el atributo _id. En la proyección solo se puede indicar que se va a mostrar o que se va a ocultar. El ejemplo dado es el único caso (que conozco por el momento) que se pueden hacer inclusiones y exclusiones de atributos a mostrar.

Al método find() se le puede enviar/concatenar los siguientes métodos:
pretty(): Muestra el resultado de la búsqueda en un formato mas legible para las personas.
sort({"nombre": 1}): Muestra el resultado de la búsqueda, ordenando los documentos de forma ascendente según el valor de la clave nombre. sort({"nombre": -1}) ordena de manera descendente.
limit(<cantidad>): Muestra los primeros <cantidad> documentos encontrados.
count(): Retorna la cantidad de documentos encontrados.
forEach(item => aFunction()): Por cada item en una colección de documentos, ejecuta una función. Recordemos que MongoDB interpreta algunas instrucciones JavaScript, por lo que podríamos definir una función de la misma forma que la escribiríamos en JavaScript para luego utilizarla en el método forEach(). 

Algunas comparaciones con where en SQL:
db.productos.find({"tipo": "limpieza"}) = select * from productos where tipo = 'limpieza'
db.productos.find({"tipo" : {$ne: "limpieza"}}) = select * from productos where tipo <> 'limpieza'
Otros operadores $:
$ lt: < (less than, menor que)
$ lte: <= (less than equals, menor e igual que)
$ gt: > (greater than, mayor que)
$ gte: >= (greater than equals, mayor e igual que)

Supongamos que el siguiente documento existe en la colección productos y queremos retornarlo:
{
    "nombre": "valde",
    "capacidad": 10,
    "proveedor": {
        "nombre": "Todo limpieza SA",
        "direccion": {
            "calle": 44,
            "numero": 560
        }
    },
    "tags": [ "limpieza", "plastico", "contenedor" ]
}

Buscar los documentos según un nombre de proveedor: db.productos.find({"proveedor.nombre": "Todo limpieza SA"})
Buscar los documentos según uno o varios tags: db.productos.find({"tags": {$all: [ "limpieza", "plastico"]} })
Buscar los documentos con tags específicos: db.productos.find({"tags": [ "limpieza", "lavanda"] }) 

* Actualizar (Update)

Para actualizar un documento, MongoDB por lo menos necesita encontrarlo y saber que cambiar, por lo que la estructura básica de un update es:
db.collection.update(<query>, <update>[, {options}])

Algunos ejemplos:
db.productos.update({"tipo": "fideo"},{$set: {"cantidad":"500","udm":"gramos"}}) Agrega al primer documento que encuentre con "tipo":"fideo" y agrega las clave:valor "cantidad":"500" y "umd":"gramos".
db.productos.update({"tipo": "fideo"}, {$unset: {"udm":""}}) Quita la clave"udm" del primer documento que encuentre con la clave:valor "tipo":fideo".
db.productos.update({"tipo": "fideo"},{$set: {"cantidad":"500","udm":"gramos"}},{multi:true}) Agrega a todos los documentos que encuentre con "tipo":"fideo" y le agrega las clave:valor "cantidad":"500" y "udm":"gramos" gracias al tercer parámetro {multi:true}.

Otra clave:valor para agregar al tercer parámetro es:
upsert:true realiza un insert si no existe un documento con la clave:valor indicada (es una mezcla entre las palabras UPdate e inSERT), ejemplo:
db.productos.update({"noExiste": "herramienta"}, {$set: {"tipo": "herramienta", "nombre": "pala"}}, {upsert: true}) Crea el Documento si no existe, con la clave:valor indicadas en el segundo parámetro.

db.productos.update({"tipo": "fideo"},{$set: {"tipo":"fideos secos"}},{multi:true}) Busca todos los documentos que tienen la clave:valor "tipo":"fideo" y cambia el valor de esa clave:valor por "tipo":"fideos secos".
db.productos.update({"tipo": "bebida"},{"tipo": "bebida","subtipo": "gaseosa", "nombre": "coca-cola"}) Busca el primer documento que encuentre con la clave:valor = "tipo":"bebida" y cambia todo el contenido de ese documento por lo indicado en el segundo parámetro, reestructurando el documento en su totalidad. 
db.productos.update({"tipo":"bebida","subtipo":"gaseosa"},{$set: {"precio":"100","cantidad":1.5,"udm":"litros"}}) Buscar el primer documento que encuentre con las clave:valor "tipo":"bebida" y "subtipo":"gaseosa" para agregarle tres clave:valor nuevas: "precio":"100", "cantidad":"1.5" y "udm":"litros". Tambien puede insertar una clave:valor con el valor siendo un array o un documento.
db.productos.update({"tipo": "importados"}, {$inc: {"precio": -240}}) Incrementa un valor numérico (el valor que tenía + el indicado). En el ejemplo vemos que podemos decrementar utilizando números negativos.
db.productos.update({"tipo": "carne"}, {$rename: {"vacuna": "ternera"}}) Cambia el nombre de una clave, en el ejemplo de vacuna a ternera.

* Quitar/Eliminar (Delete)

Existen dos métodos para eliminar documentos: deleteOne() y deleteMany(). Mediante un filtro, eliminará el documento que coincida con el filtro indicado. Puede ser una clave:valor o varias, ejemplos:
db.productos.deleteOne({"nombre":"valde", "material": "metal"}) Eliminará el primer documento que encuentre con "nombre": "valde" y "material": "metal". Retornará un objeto con una clave booleana y un contador de documentos eliminados. Tambien esta el método deleteMany() que eliminará todos los documentos que coincidan con el filtro.

Nota: Eliminar un atributo de un documento sería una actualización, por lo que se hace con el método update().

Para eliminar todos los documentos de una colección: db.unaColeccion.remove({}) o db.unaColeccion.deleteMany({}).
Para eliminar una colección de la base de datos: db.unaColeccion.drop()
Para eliminar una base de datos, primero debes switchear a la base de datos con el comando use <database_name>, y luego utilizar el comando db.dropDatabase().


Referencias:
------------
* NodeJS - https://nodejs.org/es/
* ExpressJS - https://expressjs.com/es/
* MongoDB - https://www.mongodb.com/es
* Manual driver MongoDB para NodeJS - https://docs.mongodb.com/drivers/node/current/

**Documentos:**
Este es el término que MongoDB utiliza para denominar a lo que sería un registro en una tabla de una DB relacional. Como vimos, estos pueden contener distinta estructura y atributos con respecto a otros documentos de su mismo tipo. Supongamos los siguientes Documentos de dos usuarios válidos en una misma colección:
Usuario 1:
json
{
    "nombre": "Juan",
    "email": "juan@email.com",
    "ciudad": "Buenos Aires",
    "fechaNacimiento": new Date("20/1/2021"),
    "ban": false
}
asd
