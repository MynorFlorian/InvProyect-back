export interface UserModel{
    id:number | null | undefined
    nombres: string
    apellidos: string
    nick_name:string
    password: string
    status: string
    fecha_nacimiento: Date
    fecha_creacion: Date | undefined | null
    fecha_modificacion: Date | undefined | null
}