import pandas as pd

appointments = pd.read_csv('appointments_clean.csv')

appointments.pop('pxid')    
appointments.pop('clinicid')    
appointments.pop('doctorid')   

print(appointments)

appointments.to_csv('appointments_mco2.csv', index=False)