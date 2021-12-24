import { mdbSetAtlasEnvironmentConfig, dbAccess } from './api/database.js';

mdbSetAtlasEnvironmentConfig();

const collection = 'productos';

const items = [
    {
        tipo: 'Bebida',
        marca: 'Coca-Cola',
        embase: {
            tipo: 'Botella',
            material: 'Plástico',
            retornable: false,
        },
        contenido: {
            cantidad: 600,
            udm: 'cm3',
        },
        precio: 50,
        stock: 99,
        udm: 'Unidad',
        tags: [ "Sabor original", "Coke" ],
    },
    {
        tipo: 'Bebida',
        marca: 'Sur',
        embase: {
            tipo: 'Bidón',
            material: 'Plástico',
            retornable: true,
        },
        contenido: {
            nombre: 'Agua Mineral',
            cantidad: 5,
            udm: 'Litros',
        },
        precio: 500,
        stock: 3,
        proveedor: {
            nombre: 'Fletes ya',
            telefono: '1145551234',
            email: 'contecto@fletesya.com',
        },
    },
    {
        tipo: 'Pasta',
        marca: 'Pastas frescas',
        embase: {
            tipo: 'Bolsa',
            material: 'Nylon',
            retornable: false,
        },
        contenido: {
            nombre: 'Tallarines',
            cantidad: .5,
            udm: 'Kg',
        },
        precio: 90,
        stock: 10,
        udm: 'Kg',
    },
];

console.log('Generando colección ' + collection + '...');
try {
    dbAccess('c', collection, items);
    console.log('Productos guardados en la base de datos!');
} catch (error) {
    console.log('---> Error <---\n', error);
}
console.log('');