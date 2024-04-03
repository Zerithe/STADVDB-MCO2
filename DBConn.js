import 'dotenv/config'
import { Sequelize } from 'sequelize'


export const localConnection = new Sequelize('all_appointments', 'root', 'root', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    logging: console.log()
});


//add or remove comments for which node you want to connect to
/*
//connects to central node
export const centralNodeConnection = new Sequelize('all_appointments', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: '20015',
    dialect: 'mysql',
    logging: console.log()
});

//connects to Luzon node
export const luzonNodeConnection = new Sequelize('luzon_appointments', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: '20016',
    dialect: 'mysql',
    logging: console.log()
});

//connects to VisMin node
export const visMinNodeConnection = new Sequelize('visayas_mindanao_appointments', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: '20017',
    dialect: 'mysql',
    logging: console.log()
});*/