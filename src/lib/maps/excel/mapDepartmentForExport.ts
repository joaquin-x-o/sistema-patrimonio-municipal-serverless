import type { DepartmentResponse } from "../../../interfaces/responses/departmentResponse";

export function mapDepartmentsForExport(departments: DepartmentResponse[]) {
  return departments.map((d) => ({
    "Código": d.departmentCode,
    "Área": d.name,
    "Responsable": d.responsibleName ?? "No especificado",
    "Cantidad de bienes": d.productCount,
    "Porcentaje": `${d.percentage}%`,
    "Estado": d.isActive ? "Activo" : "Inactivo",
  }));
}