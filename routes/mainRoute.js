import { Appointments } from '../DBConn.js';
import {Router} from 'express';


const router = Router();

//shows main page
router.get('/', (req, res) => {
    res.render('interface', {
        title: 'Main Interface'
    });
});

router.post('/getupdatedata', async(req, res) =>{
    const apptidSearch = req.body.textData;
    try{
        const appointment = await FindOne({
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
            console.log('Successfully Fetched Appointment for Updating', formattedAppointment);
            res.json(formattedAppointment);
        }
    } catch(err){
        console.log('Error Fetching Appointment for Update', err);
        res.status(500).send('Error processing request');
    }
});

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

export default router;