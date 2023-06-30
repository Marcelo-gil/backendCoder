//Import del dao de manejo de datos con archivos

import mongoProductDao from './dbManager/productManager.js'
import mongoUserDao from './dbManager/userManager.js'
import mongoCartDao from './dbManager/cartManager.js'

//Crear las instancia de manejo de datos con archivos

const MongoProductDao = new mongoProductDao();
const MongoUserDao = new mongoUserDao();
const MongoCartDao = new mongoCartDao();

export const PRODUCTSDAO = MongoProductDao;
export const USERSDAO = MongoUserDao;
export const CARTSDAO = MongoCartDao;