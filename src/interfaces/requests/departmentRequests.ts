// crear usuario
export interface CreateDepartmentDto {
    departmentCode: string;
    name: string;
    responsibleName: string
}

export interface UpdateDepartmentDto {
    departmentCode?: string;
    name?: string;
    responsibleName?: string
    updatedAt: string
}