export interface MovementHistoryResponse {
    transferDate: string;
    reasonForMovement: string;
    originDepartment: { departmentCode: string; name: string };
    destinationDepartment: { departmentCode: string; name: string };
    user: { name: string; surname: string };
}