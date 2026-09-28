import { InferType } from "yup";
import { LoginSchema } from "./components/login/Login";

export type LoginPayload = {
    email: string,
    password: string
}
export interface UserData {
    email: string,
    userId: string
}
export interface LogOutResponse {
    message: string;
}
export interface LoginResponse {
    token: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

export type LoginType = InferType<typeof LoginSchema>;

/** FE reserve payload → API create */
export interface BookingSlot {
    id?: string;
    day: string;
    timeSlots: string[];
    booked?: boolean;
    selectedMachinesIds: Pick<Machine, "id">[]
}

/** Matches API BookingDto (camelCase JSON) */
export interface Booking {
    id: string;
    userId: string;
    buildingId: string;
    machineId: string;
    startTime: string;
    endTime: string;
    createdAt: string;
}

export interface EditSlotId {
    id: string | undefined;
}

export const TIME_SLOTS = ["08:00-11:00", "11:00-14:00", "14:00-17:00", "17:00-20:00"];

export const MAX_RESERVATIONS_PER_WEEK = 3;

/** Matches API MachineDto */
export interface Machine {
    id: string;
    name: MachineNameEnum;
    status: MachineStatusEnum;
    buildingId: string;
}


export enum MachineNameEnum {
    washing = 'washing',
    dryer = 'dryer'
}

export enum MachineStatusEnum {
    available = 'available',
    maintenance = 'maintenance'
}
