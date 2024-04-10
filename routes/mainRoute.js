import { CentralNodeAppointments, VisMinNodeAppointments, centralNodeConnection, visMinNodeConnection } from '../DBConn.js';
import {Router} from 'express';
import csvParser from 'csv-parser';
import fs from 'fs';
import { Sequelize } from 'sequelize';
import { testConnection } from '../app.js';
import { nodeStatus } from '../app.js';

var centralQueueInsert = [];
var centralQueueUpdate = [];
var visMinQueueInsert = [];
var visMinQueueUpdate = [];

const router = Router();

//shows main page
router.get('/', async (req, res) => {
    if(!nodeStatus.isCentralNodeUp){
        testConnection(centralNodeConnection, 'Central Node');
    }
    if(!nodeStatus.isVisMinNodeUp){
        testConnection(visMinNodeConnection, 'VisMin Node');
    }
    try {
        const getAppointments = await CentralNodeAppointments.findAll({limit: 1000, raw:true});
        const nodes = `
        Central Node: ${nodeStatus.isCentralNodeUp ? 'Online' : 'Offline'} |
        VisMin Node: ${nodeStatus.isVisMinNodeUp ? 'Online' : 'Offline'}
    `
        const centralNodeQueueInsert = centralQueueInsert.length;
        const centralNodeQueueUpdate = centralQueueUpdate.length;
        const visMinNodeQueueInsert = visMinQueueInsert.length;
        const visMinNodeQueueUpdate = visMinQueueUpdate.length;
        res.render('interface', {
            title: 'Main Interface',
            appointments: getAppointments,
            nodeStatus: nodes,
            centralNodeQueueInsert: centralNodeQueueInsert,
            centralNodeQueueUpdate: centralNodeQueueUpdate,
            visMinNodeQueueInsert: visMinNodeQueueInsert,
            visMinNodeQueueUpdate: visMinNodeQueueUpdate
        });
    } catch(centralErr) {
        console.log('Central Node Connection Lost ', centralErr);
        nodeStatus.isCentralNodeUp = false;
        console.log('Trying Regional nodes');
        try {
            const getVisMinAppointments = await VisMinNodeAppointments.findAll({limit: 1000, raw: true});
            const nodes = `
            Central Node: ${nodeStatus.isCentralNodeUp ? 'Online' : 'Offline'} |
            VisMin Node: ${nodeStatus.isVisMinNodeUp ? 'Online' : 'Offline'}
            `
            const centralNodeQueueInsert = centralQueueInsert.length;
            const centralNodeQueueUpdate = centralQueueUpdate.length; 
            const visMinNodeQueueInsert = visMinQueueInsert.length;
            const visMinNodeQueueUpdate = visMinQueueUpdate.length;
            res.render('interface', {
                title: 'Main Interface',
                appointments: getVisMinAppointments,
                nodeStatus: nodes,
                centralNodeQueueInsert: centralNodeQueueInsert,
                centralNodeQueueUpdate: centralNodeQueueUpdate,
                visMinNodeQueueInsert: visMinNodeQueueInsert,
                visMinNodeQueueUpdate: visMinNodeQueueUpdate
            });
        } catch(regionalErr) {
            console.log('Regional Node connection lost: ', regionalErr);
            nodeStatus.isVisMinNodeUp = false;
            res.render('interface', {
                title: 'Main Interface'
            });
        }
    }
});

/*
router.get('/display/:displaytablerows', async (req, res) => {
    const tablerows = req.params.displaytablerows;
    var getAppointments = null;
    const t = await localConnection.transaction();

    if(tablerows === 'all'){
        getAppointments = await CentralNodeAppointments.findAll({raw:true});
    } else {
        const tablerowsInt = parseInt(tablerows);
        console.log(tablerowsInt);
        getAppointments = await CentralNodeAppointments.findAll({limit: tablerowsInt, raw:true});
    }
    await t.commit();
    res.render('interface', {
        title: 'Main Interface',
        appointments: getAppointments
    });
});*/


//updates the update form whenever one types the apptid they want to update
router.post('/getformdata', async(req, res) =>{
    console.log('get form data called ', req.body.textData);
    const apptidSearch = req.body.textData;
    //transaction handling in sequelize. Not sure if we can use this based on specs

    try{
        //NEED EDITING HERE FOR WHEN NODE IS DOWN BY USING OTHER NODES TO SEARCH
        const appointment = await CentralNodeAppointments.findOne({
            where: {apptid: apptidSearch}
        });
        console.log('gotten data ', appointment);
        if(appointment){
            const formattedAppointment = {
                apptid: appointment.apptid,
                pxid: appointment.pxid,
                clinicid: appointment.clinicid,
                doctorid: appointment.doctorid,
                hospitalname: appointment.hospitalname,
                mainspecialty: appointment.mainspecialty,
                RegionName: appointment.RegionName,
                status: appointment.status,
                TimeQueued: appointment.TimeQueued,
                QueueDate: appointment.QueueDate,
                StartTime: appointment.StartTime,
                EndTime: appointment.EndTime,
                type: appointment.type,
                Virtual: appointment.Virtual,
                Location: appointment.Location
            }
            if(formattedAppointment.TimeQueued){
                formattedAppointment.TimeQueued = formattedAppointment.TimeQueued.toISOString().slice(0, 16);
            }
            if(formattedAppointment.QueueDate){
                formattedAppointment.QueueDate = formattedAppointment.QueueDate.toISOString().slice(0, 16);
            }
            if(formattedAppointment.StartTime){
                formattedAppointment.StartTime = formattedAppointment.StartTime.toISOString().slice(0, 16);
            }
            if(formattedAppointment.EndTime){
                formattedAppointment.EndTime = formattedAppointment.EndTime.toISOString().slice(0, 16);
            }

            //transaction commit
            console.log('Successfully Fetched Appointment for Updating', formattedAppointment);
            res.json({formattedAppointment});
        }
    } catch(err){
        //change to recovery algorithm 


        console.log('Error Fetching Appointment for Update', err);
        res.status(500).send('Error processing request');
    }
});

 
//inserts new appointment
router.post('/insertdata', async(req, res) => {
    console.log('insert called');
    console.log(req.body);
    const {
        apptid,
        pxid,
        clinicid,
        doctorid,
        hospital,
        mainspecialty,
        region,
        status,
        timequeued,
        queuedate,
        startime,
        endtime,
        type,
        virtual,
        location
    } = req.body;

    if(!nodeStatus.isCentralNodeUp){
        testConnection(centralNodeConnection, 'Central Node');
    }
    if(!nodeStatus.isVisMinNodeUp){
        testConnection(visMinNodeConnection, 'VisMin Node');
    }

    try {
        if(nodeStatus.isCentralNodeUp){
            const [insertCentralAppointment, created] = await CentralNodeAppointments.findOrCreate({
                where: {apptid: apptid},
                defaults: {
                    pxid: pxid,
                    clinicid: clinicid,
                    doctorid: doctorid,
                    hospitalname: hospital,
                    mainspecialty: mainspecialty,
                    RegionName: region,
                    status: status,
                    TimeQueued: timequeued,
                    QueueDate: queuedate,
                    StartTime: startime,
                    EndTime: endtime,
                    type: type,
                    Virtual: virtual,
                    Location: location
                }
            });
            if(created){
                console.log('Successfully inserted appointment into central node ', insertCentralAppointment);

                if((location === 'Visayas' || location === 'Mindanao') && !nodeStatus.isVisMinNodeUp) {
                    console.log('Added to vismin queue');
                    visMinQueueInsert.push(apptid);
                }
                
            } else {
                 console.log('Appointment already in Central Node', insertCentralAppointment);
            }
        } else {
            console.log('Central Node Offline');
        }
        try {
            if(location === 'Luzon'){
                console.log('Luzon node not available in this site');
            }
            if(location === 'Visayas' || location === 'Mindanao'){
                if(nodeStatus.isVisMinNodeUp) {
                    const [insertVisMinAppointment, created] = await VisMinNodeAppointments.findOrCreate({
                        where: {apptid: apptid},
                        defaults: {
                            pxid: pxid,
                            clinicid: clinicid,
                            doctorid: doctorid,
                            hospitalname: hospital,
                            mainspecialty: mainspecialty,
                            RegionName: region,
                            status: status,
                            TimeQueued: timequeued,
                            QueueDate: queuedate,
                            StartTime: startime,
                            EndTime: endtime,
                            type: type,
                            Virtual: virtual,
                            Location: location
                        }
                    });
                    if(created){
                        console.log('Successfully inserted appointment into vismin node', insertVisMinAppointment);
                        if(!nodeStatus.isCentralNodeUp) {
                            centralQueueInsert.push(apptid);
                        }
                        res.sendStatus(200);
                    } else{
                        console.log('Appointment already in VisMin Node', insertVisMinAppointment);
                        res.sendStatus(500);
                    }
                } else {
                    console.log('VisMin node offline');
                    visMinQueueInsert.push(apptid);
                    res.sendStatus(500);
                }
            }
        } catch(regionalErr){
            console.log('Regional Node connection lost: ', regionalErr);
            if(location === 'Visayas' || location === 'Mindanao') {
                nodeStatus.isVisMinNodeUp = false;
                visMinQueueInsert.push(apptid);
            }
            res.sendStatus(500);
        }
    } catch(centralErr) {
        console.log('Central Node Connection Lost ', centralErr);
        nodeStatus.isCentralNodeUp = false;
        centralQueueInsert.push(apptid);
        console.log('Trying Regional nodes');
        try {
            if(location === 'Luzon'){
                console.log('Luzon Node not Available in this site');
                res.sendStatus(500);
            }
            if(location === 'Visayas' || location === 'Mindanao'){
                const [insertVisMinAppointment, created] = await VisMinNodeAppointments.findOrCreate({
                    where: {apptid: apptid},
                    defaults: {
                        pxid: pxid,
                        clinicid: clinicid,
                        doctorid: doctorid,
                        hospitalname: hospital,
                        mainspecialty: mainspecialty,
                        RegionName: region,
                        status: status,
                        TimeQueued: timequeued,
                        QueueDate: queuedate,
                        StartTime: startime,
                        EndTime: endtime,
                        type: type,
                        Virtual: virtual,
                        Location: location
                    }
                });
                if(created){
                    console.log('Successfully inserted appointment into vismin node', insertVisMinAppointment);
                    res.sendStatus(200);
                } else{
                    console.log('Appointment already in VisMin Node', insertVisMinAppointment);
                    res.sendStatus(500);
                }
            }
        } catch(regionalErr) {
            console.log('Regional Node connection lost: ', regionalErr);
            if(location === 'Visayas' || location === 'Mindanao') {
                nodeStatus.isVisMinNodeUp = false;
                visMinQueueInsert.push(apptid);
            }
            res.sendStatus(500);
        }
    }
});


//updates selected appointment. Selection variable is apptidSearch
router.post('/updatedata', async(req, res) => {
    console.log('update called');
    console.log(req.body);

    Object.keys(req.body).forEach(key => {
        req.body[key] = req.body[key] === '' ? null : req.body[key];
    });
    const {
        apptidSearch,
        apptid,
        pxid,
        clinicid,
        doctorid,
        hospital,
        mainspecialty,
        region,
        status,
        timequeued,
        queuedate,
        startime,
        endtime,
        type,
        virtual,
        location
    } = req.body;

    if(!nodeStatus.isCentralNodeUp){
        testConnection(centralNodeConnection, 'Central Node');
    }
    if(!nodeStatus.isVisMinNodeUp){
        testConnection(visMinNodeConnection, 'VisMin Node');
    }
    try {
        const updateCentralAppointment = await CentralNodeAppointments.update({
            apptid: apptid,
            pxid: pxid,
            clinicid: clinicid,
            doctorid: doctorid,
            hospitalname: hospital,
            mainspecialty: mainspecialty,
            RegionName: region,
            status: status,
            TimeQueued: timequeued,
            QueueDate: queuedate,
            StartTime: startime,
            EndTime: endtime,
            type: type,
            Virtual: virtual,
            Location: location
        }, {
            where: {
                apptid: apptidSearch
            }
        });
        console.log('Successfully updated appointment', updateCentralAppointment);
        try {
            if(location === 'Luzon'){
                console.log('Luzon Node not Available in this site');
            }
            if(location === 'Visayas' || location === 'Mindanao'){
                const updateVisMinAppointment = await VisMinNodeAppointments.update({
                    apptid: apptid,
                    pxid: pxid,
                    clinicid: clinicid,
                    doctorid: doctorid,
                    hospitalname: hospital,
                    mainspecialty: mainspecialty,
                    RegionName: region,
                    status: status,
                    TimeQueued: timequeued,
                    QueueDate: queuedate,
                    StartTime: startime,
                    EndTime: endtime,
                    type: type,
                    Virtual: virtual,
                    Location: location
                }, {
                    where: {
                        apptid: apptidSearch
                    }
                });
                console.log('Successfully inserted appointment into vismin node ', updateVisMinAppointment);
                res.sendStatus(200);
            }
            
        } catch(regionalErr){
            console.log('Regional Node connection lost: ', regionalErr);
            if(location === 'Visayas' || location === 'Mindanao') {
                nodeStatus.isVisMinNodeUp = false;
                visMinQueueUpdate.push(apptidSearch);
            }
            res.sendStatus(500);
        }
    } catch(centralErr) {
        console.log('Central Node Connection Lost ', centralErr);
        nodeStatus.isCentralNodeUp = false;
        centralQueueUpdate.push(apptidSearch);
        console.log('Trying Regional nodes');
        try {
            if(location === 'Luzon'){
                console.log('Luzon Node not Available in this site');
                res.sendStatus(500);
            }
            if(location === 'Visayas' || location === 'Mindanao'){
                const updateVisMinAppointment = await VisMinNodeAppointments.update({
                    apptid: apptid,
                    pxid: pxid,
                    clinicid: clinicid,
                    doctorid: doctorid,
                    hospitalname: hospital,
                    mainspecialty: mainspecialty,
                    RegionName: region,
                    status: status,
                    TimeQueued: timequeued,
                    QueueDate: queuedate,
                    StartTime: startime,
                    EndTime: endtime,
                    type: type,
                    Virtual: virtual,
                    Location: location
                }, {
                    where: {
                        apptid: apptidSearch
                    }
                });
                console.log('Successfully inserted appointment into vismin node ', updateVisMinAppointment);
                res.sendStatus(200);
            }
            
        } catch(regionalErr) {
            console.log('Regional Node connection lost: ', regionalErr);
            if(location === 'Visayas' || location === 'Mindanao') {
                nodeStatus.isVisMinNodeUp = false;
                visMinQueueUpdate.push(apptidSearch);
            }
            res.sendStatus(500);
        }
    }
});

router.get('/results', async (req, res) => {
    const searchData = req.query;
    console.log('Search data Recieved', searchData);

    if(!nodeStatus.isCentralNodeUp){
        testConnection(centralNodeConnection, 'Central Node');
    }
    if(!nodeStatus.isVisMinNodeUp){
        testConnection(visMinNodeConnection, 'VisMin Node');
    }
    const nodes = `
    Central Node: ${nodeStatus.isCentralNodeUp ? 'Online' : 'Offline'} |
    VisMin Node: ${nodeStatus.isVisMinNodeUp ? 'Online' : 'Offline'}
     `
    const centralNodeQueueInsert = centralQueueInsert.length;
    const centralNodeQueueUpdate = centralQueueUpdate.length;
    const visMinNodeQueueInsert = visMinQueueInsert.length;
    const visMinNodeQueueUpdate = visMinQueueUpdate.length;

    if(nodeStatus.isCentralNodeUp){
        try{
            const searchAppointment = await CentralNodeAppointments.findAll({
                where: searchData,
                raw: true
            });
            if(searchAppointment.length == 0){
                if(nodeStatus.isVisMinNodeUp) {
                    try{
                        const visMinSearchAppointment = await VisMinNodeAppointments.findAll({
                            where: searchData,
                            raw: true  
                        });
                        res.render('interface', {
                            title: 'Main Interface',
                            appointments: visMinSearchAppointment,
                            nodeStatus: nodes,
                            centralNodeQueueInsert: centralNodeQueueInsert,
                            centralNodeQueueUpdate: centralNodeQueueUpdate,
                            visMinNodeQueueInsert: visMinNodeQueueInsert,
                            visMinNodeQueueUpdate: visMinNodeQueueUpdate
                        });
                        if(visMinSearchAppointment.length == 0){
                            res.render('interface', {
                                title: 'Main Interface',
                                nodeStatus: nodes,
                                centralNodeQueueInsert: centralNodeQueueInsert,
                                centralNodeQueueUpdate: centralNodeQueueUpdate,
                                visMinNodeQueueInsert: visMinNodeQueueInsert,
                                visMinNodeQueueUpdate: visMinNodeQueueUpdate
                            });
                        }
                    } catch(visminerr) {
                        console.log('VisMin Node Connection Lost ', visminerr);
                        nodeStatus.isVisMinNodeUp = false;
                    }
                }
            } else {
                res.render('interface', {
                    title: 'Main Interface',
                    appointments: searchAppointment,
                    nodeStatus: nodes,
                    centralNodeQueueInsert: centralNodeQueueInsert,
                    centralNodeQueueUpdate: centralNodeQueueUpdate,
                    visMinNodeQueueInsert: visMinNodeQueueInsert,
                    visMinNodeQueueUpdate: visMinNodeQueueUpdate
                });
            }
        } catch(centralerr) {
            console.log('Central Node Connection Lost ', centralerr);
            nodeStatus.isCentralNodeUp = false;
            if(nodeStatus.isVisMinNodeUp) {
                try{
                    const visMinSearchAppointment = await VisMinNodeAppointments.findAll({
                        where: searchData,
                        raw: true  
                    });
                    res.render('interface', {
                        title: 'Main Interface',
                        appointments: visMinSearchAppointment,
                        nodeStatus: nodes,
                        centralNodeQueueInsert: centralNodeQueueInsert,
                        centralNodeQueueUpdate: centralNodeQueueUpdate,
                        visMinNodeQueueInsert: visMinNodeQueueInsert,
                        visMinNodeQueueUpdate: visMinNodeQueueUpdate
                    });
                    if(visMinSearchAppointment.length == 0){
                        res.render('interface', {
                            title: 'Main Interface',
                            nodeStatus: nodes,
                            centralNodeQueueInsert: centralNodeQueueInsert,
                            centralNodeQueueUpdate: centralNodeQueueUpdate,
                            visMinNodeQueueInsert: visMinNodeQueueInsert,
                            visMinNodeQueueUpdate: visMinNodeQueueUpdate
                        });
                    }
                } catch(visminerr) {
                    console.log('VisMin Node Connection Lost ', visminerr);
                    nodeStatus.isVisMinNodeUp = false;
                }
            }
        }
    }
/*
    try{//add crashing and recovery handling for other nodes
        const searchAppointment = await CentralNodeAppointments.findAll({
            where: searchData,
            raw: true
        });
        if(searchAppointment.length == 0){
            console.log('appointment not found');
        }
        console.log('search appointment complete', searchAppointment);
        res.render('interface', {
            title: 'Main Interface',
            appointments: searchAppointment
        });
    } catch(err) {
        console.log('Error searching', err);
    }*/
});

router.get('/locationcountreport', async (req, res) => {
    if(!nodeStatus.isCentralNodeUp){
        testConnection(centralNodeConnection, 'Central Node');
    }
    if(!nodeStatus.isVisMinNodeUp){
        testConnection(visMinNodeConnection, 'VisMin Node');
    }
    if(nodeStatus.isCentralNodeUp) {
        try {
            const reportAppointment = await CentralNodeAppointments.findAll({
                attributes: [
                    'Location',
                    [Sequelize.fn('COUNT', Sequelize.col('apptid')), 'apptidCount']
                ],
                group: 'Location',
                raw: true
            });
            console.log('report generated ', reportAppointment);
            res.json(reportAppointment);
        } catch(centralerr) {
            console.log('Central Node Connection Lost ', centralerr);
            nodeStatus.isCentralNodeUp = false;
        }
    } else if(nodeStatus.isVisMinNodeUp) {
        let visMinReportAppoinment;
        try {
            visMinReportAppoinment = await VisMinNodeAppointments.findAll({
                attributes: [
                    'Location',
                    [Sequelize.fn('COUNT', Sequelize.col('apptid')), 'apptidCount']
                ],
                group: 'Location',
                raw: true
            });
        } catch(visminerr) {
            console.log('VisMin Node Connection Lost ', visminerr);
            nodeStatus.isVisMinNodeUp = false;
        }
        res.json(visMinReportAppoinment);
    } else {
        console.log('Needed Nodes are offline');
        res.sendStatus(500);
    }
});

router.get('/mainspecialtycountreport', async (req, res) => {
    if(!nodeStatus.isCentralNodeUp){
        testConnection(centralNodeConnection, 'Central Node');
    }
    if(!nodeStatus.isVisMinNodeUp){
        testConnection(visMinNodeConnection, 'VisMin Node');
    }
    if(nodeStatus.isCentralNodeUp) {
        try {
            const reportAppointment = await CentralNodeAppointments.findAll({
                attributes: [
                    'mainspecialty',
                    [Sequelize.fn('COUNT', Sequelize.col('apptid')), 'apptidCount']
                ],
                group: 'mainspecialty',
                raw: true
            });
            console.log('report generated ', reportAppointment);
            res.json(reportAppointment);
        } catch(centralerr) {
            console.log('Central Node Connection Lost ', centralerr);
            nodeStatus.isCentralNodeUp = false;
        }
    } else if(nodeStatus.isVisMinNodeUp) {
        let visMinReportAppoinment;
        try {
            visMinReportAppoinment = await VisMinNodeAppointments.findAll({
                attributes: [
                    'mainspecialty',
                    [Sequelize.fn('COUNT', Sequelize.col('apptid')), 'apptidCount']
                ],
                group: 'mainspecialty',
                raw: true
            });
        } catch(visminerr) {
            console.log('VisMin Node Connection Lost ', visminerr);
            nodeStatus.isVisMinNodeUp = false;
        }
        res.json(visMinReportAppoinment);
    } else {
        console.log('Needed Nodes are offline');
        res.sendStatus(500);
    }
});


/*
//TEMPORARY FUNCTION DELETE WHEN DEPLOYING
router.get('/importcsvlocal', async (req, res) => {
    console.log('CSV IMPORT CALLED');
    const csvFilePath = 'public/others/appointments_mco2.csv';
    
    try {
        console.log('finding file path');
        await fs.promises.access(csvFilePath);

        const results = [];

        const csvStream = fs.createReadStream(csvFilePath).pipe(csvParser());

        console.log('putting files into an array');
        var count = 0;
        for await (const record of csvStream) {
            if(count % 1000 == 0){
                console.log(count);
            }
            count = count + 1;

            for (const key in record) {
                if (record[key] === '') {
                    record[key] = null;
                }
            }
            await Appointments.create(record);
        }

        //const bulkAppointments = await Appointments.bulkCreate(results, {raw: true});
        res.sendStatus(200);

    } catch(err) {
        console.log('Error importing CSV: ', err);
        res.sendStatus(500);
    }
});
*/

router.get('/importcsv', async (req, res) => {
    console.log('CSV IMPORT CALLED');
    const csvFilePath = 'public/others/appointments_mco2.csv';
    
    try {
        console.log('finding file path');
        await fs.promises.access(csvFilePath);

        const results = [];

        const csvStream = fs.createReadStream(csvFilePath).pipe(csvParser());

        console.log('putting files into an array');
        var count = 0;
        for await (const record of csvStream) {
            if(count % 1000 == 0){
                console.log(count);
            }
            count = count + 1;

            for (const key in record) {
                if (record[key] === '') {
                    record[key] = null;
                }
            }
            await CentralNodeAppointments.create(record);
        }

        //const bulkAppointments = await Appointments.bulkCreate(results, {raw: true});
        res.sendStatus(200);

    } catch(err) {
        console.log('Error importing CSV: ', err);
        res.sendStatus(500);
    }
});


router.get('/importcsvvismin', async (req, res) => {
    console.log('CSV VisMin IMPORT CALLED');
    const csvFilePath = 'public/others/appointments_mco2.csv';

    try {
        console.log('finding file path');
        await fs.promises.access(csvFilePath);

        const results = [];

        const csvStream = fs.createReadStream(csvFilePath).pipe(csvParser());

        console.log('putting files into an array');
        var count = 0;
        for await (const record of csvStream) {
            if(count % 1000 == 0){
                console.log(count);
            }
            count = count + 1;

            for (const key in record) {
                if (record[key] === '') {
                    record[key] = null;
                }
            }
            
            if(record.Location === 'Visayas' || record.Location === 'Mindanao'){
                await VisMinNodeAppointments.create(record);
            }
        }

        //const bulkAppointments = await Appointments.bulkCreate(results, {raw: true});
        res.sendStatus(200);

    } catch(err) {
        console.log('Error importing CSV: ', err);
        res.sendStatus(500);
    }
});

router.get('/synccentral', async (req, res) => {
    testConnection(centralNodeConnection, 'Central Node');
    testConnection(visMinNodeConnection, 'VisMin Node');
    if(nodeStatus.isCentralNodeUp && nodeStatus.isVisMinNodeUp){
        if(centralQueueInsert != 0) {
            centralQueueInsert.forEach( async apptid => {
                try{
                    const visMinSearch = await VisMinNodeAppointments.search({
                        where: {apptid: apptid},
                        raw: true
                    });
                    if(visMinSearch){
                        const formattedAppointment = {
                            apptid: visMinSearch.apptid,
                            pxid: visMinSearch.pxid,
                            clinicid: visMinSearch.clinicid,
                            doctorid: visMinSearch.doctorid,
                            hospitalname: visMinSearch.hospitalname,
                            mainspecialty: visMinSearch.mainspecialty,
                            RegionName: visMinSearch.RegionName,
                            status: visMinSearch.status,
                            TimeQueued: visMinSearch.TimeQueued,
                            QueueDate: visMinSearch.QueueDate,
                            StartTime: visMinSearch.StartTime,
                            EndTime: visMinSearch.EndTime,
                            type: visMinSearch.type,
                            Virtual: visMinSearch.Virtual,
                            Location: visMinSearch.Location
                        }
                        if(formattedAppointment.TimeQueued){
                            formattedAppointment.TimeQueued = formattedAppointment.TimeQueued.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.QueueDate){
                            formattedAppointment.QueueDate = formattedAppointment.QueueDate.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.StartTime){
                            formattedAppointment.StartTime = formattedAppointment.StartTime.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.EndTime){
                            formattedAppointment.EndTime = formattedAppointment.EndTime.toISOString().slice(0, 16);
                        }
    
                        const insertCentralAppointment = await CentralNodeAppointments.create(formattedAppointment);
                    }
                } catch(err) {
                    console.log('error inserting record', err);
                    res.redirect('/');
                }
            });

            centralQueueInsert = [];

        }

        if(centralQueueUpdate != 0) {
            centralQueueUpdate.forEach( async apptid => {
                try{
                    const visMinSearch = await VisMinNodeAppointments.search({
                        where: {apptid: apptid},
                        raw: true
                    });
                    if(visMinSearch){
                        const formattedAppointment = {
                            apptid: visMinSearch.apptid,
                            pxid: visMinSearch.pxid,
                            clinicid: visMinSearch.clinicid,
                            doctorid: visMinSearch.doctorid,
                            hospitalname: visMinSearch.hospitalname,
                            mainspecialty: visMinSearch.mainspecialty,
                            RegionName: visMinSearch.RegionName,
                            status: visMinSearch.status,
                            TimeQueued: visMinSearch.TimeQueued,
                            QueueDate: visMinSearch.QueueDate,
                            StartTime: visMinSearch.StartTime,
                            EndTime: visMinSearch.EndTime,
                            type: visMinSearch.type,
                            Virtual: visMinSearch.Virtual,
                            Location: visMinSearch.Location
                        }
                        if(formattedAppointment.TimeQueued){
                            formattedAppointment.TimeQueued = formattedAppointment.TimeQueued.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.QueueDate){
                            formattedAppointment.QueueDate = formattedAppointment.QueueDate.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.StartTime){
                            formattedAppointment.StartTime = formattedAppointment.StartTime.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.EndTime){
                            formattedAppointment.EndTime = formattedAppointment.EndTime.toISOString().slice(0, 16);
                        }
    
                        const updateCentralAppointment = await CentralNodeAppointments.create(formattedAppointment, {
                            where: {
                                apptid: apptid
                            }
                        });
                    }
                } catch(err) {
                    console.log('error updating record', err);
                    res.redirect('/');
                }
            });

            centralQueueUpdate = [];

        }
    }
    res.redirect('/');
});

router.get('/syncluzonvismin', async (req, res) => {
    testConnection(centralNodeConnection, 'Central Node');
    testConnection(visMinNodeConnection, 'VisMin Node');
    if(nodeStatus.isCentralNodeUp && nodeStatus.isVisMinNodeUp){
        if(visMinQueueInsert != 0) {
            visMinQueueInsert.forEach( async apptid => {
                try{
                    const centralSearch = await CentralNodeAppointments.findOne({
                        where: {apptid: apptid},
                        raw: true
                    });
                    if(centralSearch){
                        const formattedAppointment = {
                            apptid: centralSearch.apptid,
                            pxid: centralSearch.pxid,
                            clinicid: centralSearch.clinicid,
                            doctorid: centralSearch.doctorid,
                            hospitalname: centralSearch.hospitalname,
                            mainspecialty: centralSearch.mainspecialty,
                            RegionName: centralSearch.RegionName,
                            status: centralSearch.status,
                            TimeQueued: centralSearch.TimeQueued,
                            QueueDate: centralSearch.QueueDate,
                            StartTime: centralSearch.StartTime,
                            EndTime: centralSearch.EndTime,
                            type: centralSearch.type,
                            Virtual: centralSearch.Virtual,
                            Location: centralSearch.Location
                        }
                        if(formattedAppointment.TimeQueued){
                            formattedAppointment.TimeQueued = formattedAppointment.TimeQueued.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.QueueDate){
                            formattedAppointment.QueueDate = formattedAppointment.QueueDate.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.StartTime){
                            formattedAppointment.StartTime = formattedAppointment.StartTime.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.EndTime){
                            formattedAppointment.EndTime = formattedAppointment.EndTime.toISOString().slice(0, 16);
                        }
                        
                        const insertVisMinAppointment = await VisMinNodeAppointments.create(formattedAppointment);
                    }
                } catch(err) {
                    console.log('error inserting record', err);
                    res.redirect('/');
                }
            });

            visMinQueueInsert = [];
        }

        if(visMinQueueUpdate != 0) {
            visMinQueueUpdate.forEach( async apptid => {
                try{
                    const centralSearch = await CentralNodeAppointments.findOne({
                        where: {apptid: apptid},
                        raw: true
                    });
                    if(centralSearch){
                        const formattedAppointment = {
                            apptid: centralSearch.apptid,
                            pxid: centralSearch.pxid,
                            clinicid: centralSearch.clinicid,
                            doctorid: centralSearch.doctorid,
                            hospitalname: centralSearch.hospitalname,
                            mainspecialty: centralSearch.mainspecialty,
                            RegionName: centralSearch.RegionName,
                            status: centralSearch.status,
                            TimeQueued: centralSearch.TimeQueued,
                            QueueDate: centralSearch.QueueDate,
                            StartTime: centralSearch.StartTime,
                            EndTime: centralSearch.EndTime,
                            type: centralSearch.type,
                            Virtual: centralSearch.Virtual,
                            Location: centralSearch.Location
                        }
                        if(formattedAppointment.TimeQueued){
                            formattedAppointment.TimeQueued = formattedAppointment.TimeQueued.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.QueueDate){
                            formattedAppointment.QueueDate = formattedAppointment.QueueDate.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.StartTime){
                            formattedAppointment.StartTime = formattedAppointment.StartTime.toISOString().slice(0, 16);
                        }
                        if(formattedAppointment.EndTime){
                            formattedAppointment.EndTime = formattedAppointment.EndTime.toISOString().slice(0, 16);
                        }
                        
                        const updateVisMinAppointment = await VisMinNodeAppointments.update(formattedAppointment, {
                            where: {
                                apptid: apptid
                            }
                        });
                    }
                } catch(err) {
                    console.log('error inserting record', err);
                    res.redirect('/');
                }
            });
            visMinQueueUpdate = [];
        }
    }
    res.redirect('/');
});



export default router;


/*
for await (const record of csvStream) {
            if(count % 10000 == 0){
                console.log(count);
            }
            count = count + 1;

            for (const key in record) {
                if (record[key] === '') {
                    record[key] = null;
                }
            }
            try{
                await Appointments.create(record);
            } catch(err) {
                console.error('Error inserting records', err);
                console.log(record);
                return;
            }
        }
*/ 


/*
try {
        
        try {
            
            res.sendStatus(200);
        } catch(regionalErr){
            console.log('Regional Node connection lost: ', regionalErr);
            if(location === 'Luzon') {
                nodeStatus.isLuzonNodeUp = false;
                
            } else {
                nodeStatus.isVisMinNodeUp = false;
                
            }
            res.sendStatus(500);
        }
    } catch(centralErr) {
        console.log('Central Node Connection Lost ', centralErr);
        nodeStatus.isCentralNodeUp = false;
        
        console.log('Trying Regional nodes');
        try {
            
        } catch(regionalErr) {
            console.log('Regional Node connection lost: ', regionalErr);
            if(location === 'Luzon') {
                nodeStatus.isLuzonNodeUp = false;
            } else {
                nodeStatus.isVisMinNodeUp = false;
            }
            res.sendStatus(500);
        }
    }



*/