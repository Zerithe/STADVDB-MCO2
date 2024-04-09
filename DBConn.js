import 'dotenv/config'
import { Sequelize } from 'sequelize'


export const localConnection = new Sequelize('all_appointments', 'root', 'root', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    logging: console.log(),
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE
});


//connects to central node
export const centralNodeConnection = new Sequelize('all_appointments', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20015,
    dialect: 'mysql',
    logging: console.log(),
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.COMMITTED
});

//connects to Luzon node
export const luzonNodeConnection = new Sequelize('luzon_appointments', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: 20016,
    dialect: 'mysql',
    logging: console.log(),
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.COMMITTED
});

//connects to VisMin node
export const visMinNodeConnection = new Sequelize('visayas_mindanao_appointments', 'root', 'root', {
    host: 'ccscloud.dlsu.edu.ph',
    port: '20017',
    dialect: 'mysql',
    logging: console.log(),
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.COMMITTED
});


async function setTimeoutTimes() {
    try {
    const res1 = await localConnection.query('SET SESSION wait_timeout=300');
    const res2 = await localConnection.query('SET SESSION interactive_timeout=300');
    } catch(err){
        console.log('error changing timeout');
    }
}

setTimeoutTimes();
//add or remove comments for which node you want to connect to
/*


*/
export const Appointments = localConnection.define('appointment', {
    pxid: { type: Sequelize.STRING, allowNull: true },
    clinicid: { type: Sequelize.STRING, allowNull: true },
    doctorid: { type: Sequelize.STRING, allowNull: true },
    apptid: { type: Sequelize.STRING, allowNull: true,  primaryKey:true },
    status: { type: Sequelize.STRING, allowNull: true },
    TimeQueued: { type: Sequelize.DATE(6), allowNull: true },
    QueueDate: { type: Sequelize.DATE, allowNull: true },
    StartTime: { type: Sequelize.DATE, allowNull: true },
    EndTime: { type: Sequelize.DATE, allowNull: true },
    type: { type: Sequelize.STRING, allowNull: true },
    Virtual: { type: Sequelize.BOOLEAN, allowNull: true },
    mainspecialty: { type: Sequelize.STRING, allowNull: true },
    hospitalname: { type: Sequelize.STRING, allowNull: true },
    RegionName: { type: Sequelize.STRING, allowNull: true },
    Location: { type: Sequelize.STRING, allowNull: true }
  }, {
    tableName: 'appointments' // Make sure this matches your actual table name
  });

  export const CentralNodeAppointments = centralNodeConnection.define('appointments', {
    pxid: { type: Sequelize.STRING, allowNull: true },
    clinicid: { type: Sequelize.STRING, allowNull: true },
    doctorid: { type: Sequelize.STRING, allowNull: true },
    apptid: { type: Sequelize.STRING, allowNull: true,  primaryKey:true },
    status: { type: Sequelize.STRING, allowNull: true },
    TimeQueued: { type: Sequelize.DATE(6), allowNull: true },
    QueueDate: { type: Sequelize.DATE, allowNull: true },
    StartTime: { type: Sequelize.DATE, allowNull: true },
    EndTime: { type: Sequelize.DATE, allowNull: true },
    type: { type: Sequelize.STRING, allowNull: true },
    Virtual: { type: Sequelize.BOOLEAN, allowNull: true },
    mainspecialty: { type: Sequelize.STRING, allowNull: true },
    hospitalname: { type: Sequelize.STRING, allowNull: true },
    RegionName: { type: Sequelize.STRING, allowNull: true },
    Location: { type: Sequelize.STRING, allowNull: true }
  }, {
    tableName: 'appointments' // Make sure this matches your actual table name
  });

  export const LuzonNodeAppointments = luzonNodeConnection.define('appointments', {
    pxid: { type: Sequelize.STRING, allowNull: true },
    clinicid: { type: Sequelize.STRING, allowNull: true },
    doctorid: { type: Sequelize.STRING, allowNull: true },
    apptid: { type: Sequelize.STRING, allowNull: true,  primaryKey:true },
    status: { type: Sequelize.STRING, allowNull: true },
    TimeQueued: { type: Sequelize.DATE(6), allowNull: true },
    QueueDate: { type: Sequelize.DATE, allowNull: true },
    StartTime: { type: Sequelize.DATE, allowNull: true },
    EndTime: { type: Sequelize.DATE, allowNull: true },
    type: { type: Sequelize.STRING, allowNull: true },
    Virtual: { type: Sequelize.BOOLEAN, allowNull: true },
    mainspecialty: { type: Sequelize.STRING, allowNull: true },
    hospitalname: { type: Sequelize.STRING, allowNull: true },
    RegionName: { type: Sequelize.STRING, allowNull: true },
    Location: { type: Sequelize.STRING, allowNull: true }
  }, {
    tableName: 'appointments' // Make sure this matches your actual table name
  });

  export const VisMinNodeAppointments = visMinNodeConnection.define('appointments', {
    pxid: { type: Sequelize.STRING, allowNull: true },
    clinicid: { type: Sequelize.STRING, allowNull: true },
    doctorid: { type: Sequelize.STRING, allowNull: true },
    apptid: { type: Sequelize.STRING, allowNull: true,  primaryKey:true },
    status: { type: Sequelize.STRING, allowNull: true },
    TimeQueued: { type: Sequelize.DATE(6), allowNull: true },
    QueueDate: { type: Sequelize.DATE, allowNull: true },
    StartTime: { type: Sequelize.DATE, allowNull: true },
    EndTime: { type: Sequelize.DATE, allowNull: true },
    type: { type: Sequelize.STRING, allowNull: true },
    Virtual: { type: Sequelize.BOOLEAN, allowNull: true },
    mainspecialty: { type: Sequelize.STRING, allowNull: true },
    hospitalname: { type: Sequelize.STRING, allowNull: true },
    RegionName: { type: Sequelize.STRING, allowNull: true },
    Location: { type: Sequelize.STRING, allowNull: true }
  }, {
    tableName: 'appointments' // Make sure this matches your actual table name
  });


//CREATE TABLE appointments(pxid VARCHAR(255), clinicid VARCHAR(255), doctorid VARCHAR(255), apptid VARCHAR(255),  `status` VARCHAR(255), TimeQueued DATETIME(6), QueueDate DATETIME, StartTime DATETIME, EndTime DATETIME, type VARCHAR(255), `Virtual` TINYINT, Hospital VARCHAR(255), mainspecialty VARCHAR(255), hospitalname VARCHAR(255), RegionName VARCHAR(255), Location VARCHAR(255));
