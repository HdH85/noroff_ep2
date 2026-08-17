import { z } from 'zod';

export const registerSchema = z.object({
            firstname: z.string().min(1),
            lastname: z.string().min(1),
            email: z.email(),
            password: z.string().min(8),
            confirmPassword: z.string(),
            ssn: z.string().min(1),
            birthdate: z.coerce.date(),
            genderId: z.coerce.number(),
            taxNumber: z.string().min(1),
            religion: z.string().min(1),
            driversLicenseNumber: z.string().min(1),
            medicalInsuranceNumber: z.string().min(1)
        }).refine((data) => data.password === data.confirmPassword, {
            message: "Password mismatch",
            path: ["confirmPassword"],
});

export const loginSchema = z.object({
        email: z.string(),
        password: z.string()
});

export const patientSchema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.email(),
    genderId: z.coerce.number(),
});

export const appointmentSchema = z.object({
        patientId: z.coerce.number(),
        doctorId: z.coerce.number(),
        locationId: z.coerce.number(),
        start: z.string(),
        description: z.string().optional()
});

export const editAppointmentSchema = z.object({
    id: z.coerce.number(),
    patientId: z.coerce.number(),
    doctorId: z.coerce.number(),
    locationId: z.coerce.number(),
    start: z.string(),
    description: z.string().optional()
});