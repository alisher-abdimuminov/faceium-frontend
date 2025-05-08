export interface IResponse<TCode, IData>{
    status: "success" | "error"
    code: TCode
    data: IData
}

export interface IWorkingTime {
    name: string
    start: string
    end: string
}

export interface IUser {
    username: string
    first_name: string
    last_name: string
    role: "admin" | "subadmin"
    token: string
}

export interface IDepartment {
    id: string
    name: string
    active: boolean
    employees: number
}

export interface IEmployee {
    uuid: string
    handle: string
    full_name: string
    department: IDepartment
    position: string
    gender: "male" | "female"
    working_time: string
    birth_date: string
    image: string
    country: string
    city: string
    town: string
    address: string
    phone: string
}

export interface IAttendance {
    uuid: string
    full_name: string
    department: IDepartment
    attendance_access: "arrived" | "late" | "failed" | "did_not_come" | "in_vocation"
    attendance_access_time: string
    attendance_access_area: string
    attendance_output: "gone" | "failed" | "at_work"
    attendance_output_time: string
    vocation: { type: string, start: string, end: string }[]
    image: string
}

export interface IReport {
    uuid: string
    full_name: string
    attendance_access: "arrived" | "late" | "failed" | "did_not_come" | "in_vocation"
    attendance_access_time: string
    vocation: { type: string, start: string, end: string }[]
}

export interface IReports {
    [date: string]: IReport[]
}

export interface ICoordinate {
    latitude: string
    longitude: string
}

export interface IArea {
    id: string
    name: string
    coordinates: ICoordinate[]
}

export type TLoginError = 
    | "username_not_found"
    | "invalid_password"

export interface IStatistic {
    department: string
    all: number
    arrived: number
    late: number
    didnotcome: number
}