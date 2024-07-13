import { WeekNumberLabel } from "react-day-picker"

export type TResponeData = {
    message: string
    status: number
}

export type TDrone = {
    droneID: string
    droneName: string
    droneTag: string
    droneBrand: string
    droneModel: string
    droneStatus: boolean
    droneCreatedAt: Date
    droneUpdatedAt: Date
    droneAvatar?: TDroneAvatar
    droneLocation?: TDroneLocation
    dronePath?: TDronePath
}

export type TDronePath = {
    pathID: string
    droneId: string
    drone: TDrone
    droneFlyAt: Date
    dronePath: TPathLatLng[]
}

export type TDroneAvatar = {
    avatarId: string
    droneId: string
    avatarURL: string
    avatarURLName: string
}

export type TDroneLocation = {
    locationID: string
    droneID: string
    locationName: string
    locationLat: number
    locationLng: number
}

export type TPathLatLng = {
    latlngID: string
    pathID: string
    path: TDronePath
    lat: number
    lng: number
}

export type TLatLng = {
    lat: number;
    lng: number;
}

export type TPlace = {
    name: string;
    address: string;
    latitude: number;
    longtitude: number;
}



export type TDataHour = {
    dmz_id: string
    dmz_name: string
    mean_pressure_tp: number
    mean_pressure_azp: number
    dt: string
}

export type TDataMidnight = {
    mean_tp_midnight: number
    mean_azp_midnight: number
    dt: string
}

