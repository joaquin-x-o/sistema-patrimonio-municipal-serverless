export interface MaintenanceHistoryResponse {
    repairDate: string;
    repairDescription: string;
    unusableDate: string;
    breakdownReason: string;
    cost: number;
    user: {
        name: string;
        surname: string;
    };
}

export interface MaintenanceExportRow {
  repair_date: string | null;
  repair_description: string | null;
  unusable_date: string | null;
  breakdown_reason: string | null;
  cost: number | null;
  user: { name: string; surname: string } | null;
}