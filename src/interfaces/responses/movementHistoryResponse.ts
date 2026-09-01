export interface MovementHistoryResponse {
    transferDate: string;
    reasonForMovement: string;
    originDepartment: { departmentCode: string; name: string };
    destinationDepartment: { departmentCode: string; name: string };
    user: { name: string; surname: string };
}

export interface MovementExportRow {
  date: string;
  reason: string | null;
  user: { name: string; surname: string } | null;
  origin: { code: string; name: string } | null;
  destination: { code: string; name: string } | null;
}