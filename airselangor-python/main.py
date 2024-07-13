import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.route import router

app = FastAPI()
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# averages = calculate_average_pressure(df, 'dmz_name', 'pressure_tp (m)')
# for location, average in averages.items():
# print(f"Average 'pressure_tp (m)' for location '{location}': {average}")

# january_average_2023 = calculate_january_average(df, 'dt', 'pressure_tp (m)')
# print(f"Average 'pressure_tp (m)' for January 2023: {january_average_2023}")
