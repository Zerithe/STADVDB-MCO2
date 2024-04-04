const insertBtn = document.querySelector('#insert');
const updateBtn = document.querySelector('#update');

insertBtn.addEventListener('click', (e) => {
    var insertContent = document.querySelector('#insert-content');
    insertContent.style.display = insertContent.style.display === 'none' ? 'block' : 'none';
});

updateBtn.addEventListener('click', (e) => {
    var updateContent = document.querySelector('#update-content');
    updateContent.style.display = updateContent.style.display === 'none' ? 'block' : 'none';
});


const insertForm = document.querySelector('#insert-content-form');
insertForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    var location;
    const apptid = document.querySelector('#apptid-insert').value;
    const pxid = document.querySelector('#pxid-insert').value;
    const clinicid = document.querySelector('#clinicid-insert').value;
    const doctorid = document.querySelector('#doctorid-insert').value;
    const hospital = document.querySelector('#hospital-insert').value;
    const mainspecialty = document.querySelector('#mainspecialty-insert').value;
    const region = document.querySelector('#region-insert').value;
    const status = document.querySelector('#status-insert').value;
    const timequeued = document.querySelector('#timequeued-insert').value;
    const queuedate = document.querySelector('#queuedate-insert').value;
    const startime = document.querySelector('#startime-insert').value;
    const endtime = document.querySelector('#endtime-insert').value;
    const type = document.querySelector('#type-insert').value;
    const virtual = document.querySelector('#virtual-insert').value;
    if(region === 'National Capital Region (NCR)' || region === 'CALABARZON (IV-A)' || region === 'Ilocos Region (I)' || region === 'Bicol Region (V)' || region === 'Central Luzon (III)'){
        location = 'Luzon';
    } else if(region === 'Central Visayas (VII)' || region === 'Eastern Visayas (VIII)' || region === 'Western Visayas (VI)'){
        location = 'Visayas';
    } else {
        location = 'Mindanao';
    }

    const jstring = JSON.stringify({
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
    });

    try {
        const response = await fetch('/insertdata', {
            method: 'POST',
            body: jstring,
            headers: {
                'content-type': 'application/json'
            }
        });
        console.log(response.status);
        if(response.status == 200){
            const result = document.querySelector('#insert-results');
            alert('Succesfully Inserted Appointment');
            location.reload;
        }
    } catch(err) {
        console.log('Error Inserting Appointment', err.message);
        alert('Error Inserting Appointment');
    }
});

const updateForm = document.querySelector('#update-content-form');
updateForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    var location;
    const apptidSearch = document.querySelector('#apptid-update-search').value;
    const apptid = document.querySelector('#apptid-insert').value;
    const pxid = document.querySelector('#pxid-insert').value;
    const clinicid = document.querySelector('#clinicid-insert').value;
    const doctorid = document.querySelector('#doctorid-insert').value;
    const hospital = document.querySelector('#hospital-insert').value;
    const mainspecialty = document.querySelector('#mainspecialty-insert').value;
    const region = document.querySelector('#region-insert').value;
    const status = document.querySelector('#status-insert').value;
    const timequeued = document.querySelector('#timequeued-insert').value;
    const queuedate = document.querySelector('#queuedate-insert').value;
    const startime = document.querySelector('#startime-insert').value;
    const endtime = document.querySelector('#endtime-insert').value;
    const type = document.querySelector('#type-insert').value;
    const virtual = document.querySelector('#virtual-insert').value;
    if(region === 'National Capital Region (NCR)' || region === 'CALABARZON (IV-A)' || region === 'Ilocos Region (I)' || region === 'Bicol Region (V)' || region === 'Central Luzon (III)'){
        location = 'Luzon';
    } else if(region === 'Central Visayas (VII)' || region === 'Eastern Visayas (VIII)' || region === 'Western Visayas (VI)'){
        location = 'Visayas';
    } else {
        location = 'Mindanao';
    }

    const jstring = JSON.stringify({
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
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var timeout = null;
    document.querySelector('#apptid-update-search').addEventListener('keyup', function () {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            var textvalue = document.querySelector('#studentId').value;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/getupdatedata', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() { 
                if(xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var appointmentData = response.formattedAppointment;
                    document.querySelector('#apptid-insert').value = appointmentData.apptid;
                    document.querySelector('#pxid-insert').value = appointmentData.pxid;
                    document.querySelector('#clinicid-insert').value = appointmentData.clinicid;
                    document.querySelector('#doctorid-insert').value = appointmentData.doctorid;
                    document.querySelector('#hospital-insert').value = appointmentData.hospitalname;
                    document.querySelector('#mainspecialty-insert').value = appointmentData.mainspecialty;
                    document.querySelector('#region-insert').value;
                    document.querySelector('#status-insert').value;
                    document.querySelector('#timequeued-insert').value = appointmentData.TimeQueued;
                    document.querySelector('#queuedate-insert').value = appointmentData.QueueDate;
                    document.querySelector('#startime-insert').value = appointmentData.StartTime;
                    document.querySelector('#endtime-insert').value = appointmentData.EndTime;
                    document.querySelector('#type-insert').value = appointmentData.type;
                    document.querySelector('#virtual-insert').value;
                }
            }
        });
    });
});