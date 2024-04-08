import { Appointments, CentralNodeAppointments, LuzonNodeAppointments, VisMinNodeAppointments } from '../DBConn.js';
import {Router} from 'express';
import { localConnection } from '../DBConn.js';
import csvParser from 'csv-parser';
import fs from 'fs';


const router = Router();

//shows main page
router.get('/', async (req, res) => {
    const getAppointments = await CentralNodeAppointments.findAll({limit: 10, raw:true});
    res.render('interface', {
        title: 'Main Interface',
        appointments: getAppointments
    });
});

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
});


//updates the update form whenever one types the apptid they want to update
router.post('/getformdata', async(req, res) =>{
    const apptidSearch = req.body.textData;
    //transaction handling in sequelize. Not sure if we can use this based on specs
    const t = await localConnection.transaction();

    try{
        const appointment = await Appointments.findOne({
            where: {apptid: apptidSearch}
        });
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
            await t.commit()
            console.log('Successfully Fetched Appointment for Updating', formattedAppointment);
            res.json({formattedAppointment});
        }
    } catch(err){
        //change to recovery algorithm 
        await t.rollback();
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

    try {
        const insertAppointment = await Appointments.create({
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
        });
        console.log('Successfully inserted appointment', insertAppointment);
        res.sendStatus(200);
    } catch(err) {
        console.log('Error inserting appointment: ', err);
        res.sendStatus(400);
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

    const t = await localConnection.transaction();
    try {
        const updateAppointment = await Appointments.update({
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
        await t.commit();
        console.log('Successfully updated appointment', updateAppointment);
        res.sendStatus(200);
    } catch(err) {
        await t.rollback();
        console.log('Error updating appointment: ', err);
        res.sendStatus(400);
    }
});

router.post('/searchdata', async (req, res) =>{
    console.log('search called');
    console.log(req.body);
    if(req.body.dataType === 'apptid'){
        console.log('apptid search');
        const apptid = req.body.apptidQuery;
        const t = await localConnection.transaction();
        try{
            const searchAppointment = await Appointments.findAll({where: {apptid: apptid}, raw: true});
            await t.commit();
            console.log('search appointment complete', searchAppointment);
            res.render('interface', {
                title: 'Main Interface',
                appointments: searchAppointment
            });
        } catch(err) {
            await t.rollback();
            console.log('Error searching Apptid', err);
        }
    }
});

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
            try{
                await CentralNodeAppointments.create(record);
            } catch(err) {
                console.error('Error inserting records', err);
                console.log(record);
                return;
            }
        }

        //const bulkAppointments = await Appointments.bulkCreate(results, {raw: true});
        res.sendStatus(200);

    } catch(err) {
        console.log('Error importing CSV: ', err);
        res.sendStatus(500);
    }
    
    
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