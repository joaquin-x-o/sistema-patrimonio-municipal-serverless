import type { RetirementType } from "../../types/retirement.type";

export interface RetirementHistoryResponse {
    documentReference: string;
    retirementReason: string;
    retirementType: RetirementType;
    transactionDate: string;
    product: { productCode: number; name: string }
    user: { name: string; surname: string };
    department: { departmentCode: string; name: string; responsibleName: string };
}

export interface RetirementExportRow {
  doc_reference: string | null;
  reason: string | null;
  type: RetirementType;
  date: string;
  product: {
    code: number;
    name: string;
    department: { code: string; name: string; responsible_name: string } | null;
  } | null;
  user: { name: string; surname: string } | null;
}