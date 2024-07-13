import pandas as pd

# Load the CSV file into a DataFrame
df = pd.read_csv('assets/dmz_hydraulic.csv')

# Filter the DataFrame for rows where the location is "dato keramat"
filtered_df = df[df['dmz_name'] == 'Dato Keramat']
