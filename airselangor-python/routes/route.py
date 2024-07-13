from typing import Dict
from fastapi import APIRouter, HTTPException, UploadFile
from config.file import df
from services.service import calculate_average_pressure
from schema.schema import individual_average_pressure, list_average_pressure
from model.model import AveragePressure

router = APIRouter()


@router.get('/')
async def index():
    return {
        "data": "Hello"
    }


@router.get('/averagepressure')
async def getAveragePressure():
    try:
        averages = calculate_average_pressure(
            df, 'dmz_name', 'pressure_tp (m)')
        response_data = []
        for location, pressure in averages.items():
            averages_pressure = AveragePressure(
                location=location, pressure=pressure)
            response_data.append(averages_pressure)
        return response_data

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Internal Server Error {e}")
