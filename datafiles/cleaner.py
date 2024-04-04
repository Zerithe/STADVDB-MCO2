import pandas as pd
import numpy as np

appointments = pd.read_csv('appointments_mco2.csv')

print(appointments)
print(appointments.RegionName.unique())

conditions = [
    appointments['RegionName'].isin(['National Capital Region (NCR)', 'CALABARZON (IV-A)', 'Ilocos Region (I)', 'Bicol Region (V)', 'Central Luzon (III)']),
    appointments['RegionName'].isin(['Central Visayas (VII)', 'Eastern Visayas (VIII)', 'Western Visayas (VI)']),
    appointments['RegionName'].isin(['SOCCSKSARGEN (Cotabato Region) (XII)', 'Northern Mindanao (X)'])
]

choices = ['Luzon', 'Visayas', 'Mindanao']

appointments['Location'] = np.select(conditions, choices, default='Other')

print(appointments)
print(appointments.RegionName.unique())
print(appointments.Location.unique())

#appointments.to_csv('appointments_mco2.csv', index=False)