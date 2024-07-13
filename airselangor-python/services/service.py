import pandas as pd


def calculate_average_pressure(df, location_column, pressure_column):
    # Get unique locations
    unique_locations = df[location_column].unique()

    # Dictionary to store averages
    averages = {}

    # Loop through each unique location
    for location in unique_locations:
        # Filter for rows where the location matches
        location_df = df[df[location_column] == location]

        # Exclude rows with null values in the pressure column
        valid_pressure_df = location_df[location_df[pressure_column].notnull()]

        # Calculate the sum of valid pressure values
        total_pressure = valid_pressure_df[pressure_column].sum()

        # Count the number of valid rows
        valid_rows_count = valid_pressure_df[pressure_column].count()

        # Calculate the average
        if valid_rows_count > 0:
            average_pressure = total_pressure / valid_rows_count
        else:
            average_pressure = None

        # Store the average in the dictionary
        averages[location] = average_pressure

    return averages


def calculate_january_average(df, date_column, pressure_column):
    # Ensure the date column is in datetime format
    df[date_column] = pd.to_datetime(df[date_column])

    # Filter for January 2023
    january_2023_df = df[(df[date_column] >= '2023/01/01')
                         & (df[date_column] <= '2023-01-31')]

    # Exclude rows with null values in the pressure column
    valid_pressure_df = january_2023_df[january_2023_df[pressure_column].notnull(
    )]

    # Calculate the sum of valid pressure values
    total_pressure = valid_pressure_df[pressure_column].sum()

    # Count the number of valid rows
    valid_rows_count = valid_pressure_df[pressure_column].count()

    # Calculate the average
    if valid_rows_count > 0:
        average_pressure = total_pressure / valid_rows_count
    else:
        average_pressure = None

    return average_pressure
