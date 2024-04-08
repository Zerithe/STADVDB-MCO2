const insertBtn = document.querySelector('#insert');
const updateBtn = document.querySelector('#update');
const searchBtn = document.querySelector('#search');

insertBtn.addEventListener('click', (e) => {
    var insertContent = document.querySelector('#insert-content');
    insertContent.style.display = insertContent.style.display === 'none' ? 'block' : 'none';
});

updateBtn.addEventListener('click', (e) => {
    var updateContent = document.querySelector('#update-content');
    updateContent.style.display = updateContent.style.display === 'none' ? 'block' : 'none';
});

searchBtn.addEventListener('click', (E) => {
    var searchContent = document.querySelector('#search-content');
    searchContent.style.display = searchContent.style.display === 'none' ? 'block' : 'none';
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
    const region = document.querySelector('input[name="region-insert"]:checked').value;
    const status = document.querySelector('input[name="status-insert"]:checked').value;
    const timequeued = document.querySelector('#timequeued-insert').value;
    const queuedate = document.querySelector('#queuedate-insert').value;
    const startime = document.querySelector('#startime-insert').value;
    const endtime = document.querySelector('#endtime-insert').value;
    const type = document.querySelector('#type-insert').value;
    const virtual = document.querySelector('input[name="virtual-insert"]:checked').value;
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
    const apptid = document.querySelector('#apptid-update').value;
    const pxid = document.querySelector('#pxid-update').value;
    const clinicid = document.querySelector('#clinicid-update').value;
    const doctorid = document.querySelector('#doctorid-update').value;
    const hospital = document.querySelector('#hospital-update').value;
    const mainspecialty = document.querySelector('#mainspecialty-update').value;
    const region = document.querySelector('input[name="region-update"]:checked').value;
    const status = document.querySelector('input[name="status-update"]:checked').value;
    const timequeued = document.querySelector('#timequeued-update').value;
    const queuedate = document.querySelector('#queuedate-update').value;
    const startime = document.querySelector('#startime-update').value;
    const endtime = document.querySelector('#endtime-update').value;
    const type = document.querySelector('#type-update').value;
    const virtual = document.querySelector('input[name="virtual-update"]:checked').value;
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

    try {
        const response = await fetch('/updatedata', {
            method: 'POST',
            body: jstring,
            headers: {
                'content-type': 'application/json'
            }
        });
        if(response.status == 200){
            const result = document.querySelector('#update-results');
            alert('Succesfully Inserted Appointment');
            location.reload;
        }
    } catch(err) {
        console.log('Error Updating Appointment', err.message);
        alert('Error Updating Appointment');
    }
});


// const apptidSearch = document.querySelector('#search-content-apptid-form');
// apptidSearch.addEventListener('submit', (event) => {

//     const apptidQuery = document.querySelector('#search-apptid').value;  
//     const dataType = 'apptid';  
//     const jstring = JSON.stringify({apptidQuery, dataType});
//     const response = fetch('/searchdata', {
//         method: 'POST',
//         body: jstring,
//         headers: {
//             'content-type': 'application/json'
//         }
//     });
// });


//TEMPORARY FUNCTION, DELETE WHEN DEPLOYING
const importLocalCsvBtn = document.querySelector('#import-csv-local');
importLocalCsvBtn.addEventListener('click', async () => {
    try {
        const loadingContent = document.querySelector('#loading-csv');
        loadingContent.innerHTML = 'WAIT FOR CSV TO IMPORT. DO NOT REFRESH PAGE OR USE ANY FUNCTIONS. WAIT FOR PAGE TO REFRESH.';
        const response = await fetch('/importcsvlocal', {
            method: 'GET'
        });
        if(response.ok){
            location.reload();
        } else {
            alert('CSV ALREADY IMPORTED');
            location.reload();
        }
    } catch(err){
        console.log(err);
    }
});


const importCsvBtn = document.querySelector('#import-csv');
importCsvBtn.addEventListener('click', async () => {
    try {
        const loadingContent = document.querySelector('#loading-csv');
        loadingContent.innerHTML = 'WAIT FOR CSV TO IMPORT. DO NOT REFRESH PAGE OR USE ANY FUNCTIONS. WAIT FOR PAGE TO REFRESH.';
        const response = await fetch('/importcsv', {
            method: 'GET'
        });
        if(response.ok){
            location.reload();
        } else {
            alert('CSV ALREADY IMPORTED');
            location.reload();
        }
    } catch(err){
        console.log(err);
    }
});

const importCsvLuzonBtn = document.querySelector('#import-csv-luzon');
importCsvLuzonBtn.addEventListener('click', async () => {
    try {
        const loadingContent = document.querySelector('#loading-csv');
        loadingContent.innerHTML = 'WAIT FOR CSV TO IMPORT. DO NOT REFRESH PAGE OR USE ANY FUNCTIONS. WAIT FOR PAGE TO REFRESH.';
        const response = await fetch('/importcsvluzon', {
            method: 'GET'
        });
        if(response.ok){
            location.reload();
        } else {
            alert('CSV ALREADY IMPORTED');
            location.reload();
        }
    } catch(err){
        console.log(err);
    }
});

const importCsvVisMinBtn = document.querySelector('#import-csv-vismin');
importCsvVisMinBtn.addEventListener('click', async () => {
    try {
        const loadingContent = document.querySelector('#loading-csv');
        loadingContent.innerHTML = 'WAIT FOR CSV TO IMPORT. DO NOT REFRESH PAGE OR USE ANY FUNCTIONS. WAIT FOR PAGE TO REFRESH.';
        const response = await fetch('/importcsvvismin', {
            method: 'GET'
        });
        if(response.ok){
            location.reload();
        } else {
            alert('CSV ALREADY IMPORTED');
            location.reload();
        }
    } catch(err){
        console.log(err);
    }
});







document.addEventListener('DOMContentLoaded', function() {
    var timeout = null;
    document.querySelector('#apptid-update-search').addEventListener('keyup', function () {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            var textvalue = document.querySelector('#apptid-update-search').value;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/getformdata', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() { 
                if(xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    console.log(response);
                    var appointmentData = response.formattedAppointment;
                    console.log(appointmentData);
                    document.querySelector('#apptid-update').value = appointmentData.apptid;
                    document.querySelector('#pxid-update').value = appointmentData.pxid;
                    document.querySelector('#clinicid-update').value = appointmentData.clinicid;
                    document.querySelector('#doctorid-update').value = appointmentData.doctorid;
                    document.querySelector('#hospital-update').value = appointmentData.hospitalname;
                    document.querySelector('#mainspecialty-update').value = appointmentData.mainspecialty;


                    if(appointmentData.RegionName === 'National Capital Region (NCR)') {
                        document.querySelector('#region-ncr-update').checked = true;
                    } else if(appointmentData.RegionName === 'CALABARZON (IV-A)') {
                        document.querySelector('#region-calabarzon-update').checked = true;
                    } else if(appointmentData.RegionName === 'Ilocos Region (I)') {
                        document.querySelector('#region-ilocos-update').checked = true;
                    } else if(appointmentData.RegionName === 'Bicol Region (V)') {
                        document.querySelector('#region-bicol-update').checked = true;
                    } else if(appointmentData.RegionName === 'Central Luzon (III)') {
                        document.querySelector('#region-centralluzon-update').checked = true;
                    } else if(appointmentData.RegionName === 'Central Visayas (VII)') {
                        document.querySelector('#region-centralvisayas-update').checked = true;
                    } else if(appointmentData.RegionName === 'Eastern Visayas (VIII)') {
                        document.querySelector('#region-easternvisayas-update').checked = true;
                    } else if(appointmentData.RegionName === 'SOCCSKSARGEN (Cotabato Region) (XII)') {
                        document.querySelector('#region-soccsksargen-update').checked = true;
                    } else if(appointmentData.RegionName === 'Northern Mindanao (X)') {
                        document.querySelector('#region-northernmindanao-update').checked = true;
                    } else if(appointmentData.RegionName === 'Western Visayas (VI)') {
                        document.querySelector('#region-westernvisayas-update').checked = true;
                    }

                    if(appointmentData.status === 'Queued') {
                        document.querySelector('#status-queued-update').checked = true;
                    } else if(appointmentData.status === 'Complete') {
                        document.querySelector('#status-complete-update').checked = true;
                    }

                    document.querySelector('#timequeued-update').value = appointmentData.TimeQueued;
                    document.querySelector('#queuedate-update').value = appointmentData.QueueDate;
                    document.querySelector('#startime-update').value = appointmentData.StartTime;
                    document.querySelector('#endtime-update').value = appointmentData.EndTime;
                    document.querySelector('#type-update').value = appointmentData.type;
                    
                    if(appointmentData.Virtual === true) {
                        document.querySelector('#virtual-true-update').checked = true;
                    } else if(appointmentData.Virtual === false) {
                        document.querySelector('#virtual-false-update').checked = true;
                    }
                } else {
                    console.error('Request failed with status ', xhr.status);
                }
            }
            xhr.onerror = function() {
                console.log('request error');
            }
            xhr.send(JSON.stringify({textData: textvalue}));
        }, 500);
    });
});