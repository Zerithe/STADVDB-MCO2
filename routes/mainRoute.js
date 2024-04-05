import { Appointments } from '../DBConn.js';
import {Router} from 'express';
import { localConnection } from '../DBConn.js';


const router = Router();

//shows main page
router.get('/', (req, res) => {
    res.render('interface', {
        title: 'Main Interface'
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
            formattedAppointment.TimeQueued = formattedAppointment.TimeQueued.toISOString().slice(0, 16);
            formattedAppointment.QueueDate = formattedAppointment.QueueDate.toISOString().slice(0, 16);
            formattedAppointment.StartTime = formattedAppointment.StartTime.toISOString().slice(0, 16);
            formattedAppointment.EndTime = formattedAppointment.EndTime.toISOString().slice(0, 16);

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

export default router;