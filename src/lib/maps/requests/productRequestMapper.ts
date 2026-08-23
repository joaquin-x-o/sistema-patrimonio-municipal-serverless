import type { CreateProductDto, LostProductDto, RepairProductDto, RetireProductDto, TransferProductDto, UnusableProductDto, UpdateProductDto } from "../../../interfaces/requests/productRequests";
import type { CreateProductRequest, LostProductRequest, MarkProductUnusableRequest, RepairProductRequest, RetireProductRequest, TransferProductRequest, UpdateProductRequest } from "../../../schemas/product.schemas";
import { ProductStatus, type ProductCategory, type ProductCondition } from "../../../types/product.type";
import { parseNumericInput } from "../../../utils/common/priceFormatters";
import { getTodayDateISO } from "../../../utils/date/getTodayDate";

export const mapCreateProductRequestToDto = (dto: CreateProductRequest, departmentId: number): CreateProductDto => {

    const today = getTodayDateISO()

    const purchasePrice = parseNumericInput(dto.purchasePrice)
    const depreciation = parseNumericInput(dto.depreciation)


    return {
        code: Number(dto.productCode),
        name: dto.name,
        description: dto.description,
        observation: dto.observation ?? null,
        registration_date: dto.registrationDate ?? today,
        physical_condition: dto.physicalCondition as ProductCondition,
        category: dto.category as ProductCategory,
        is_legacy: dto.isLegacy ?? false,
        status: ProductStatus.ACTIVE,
        last_check_date: today,
        status_updated_at: today,
        department_id: departmentId,
        invoice_number: dto.invoiceNumber ?? null,
        purchase_price: purchasePrice ?? null,
        depreciation: depreciation ?? null,
    };
};

export const mapUpdateProductRequestToDto = (dto: UpdateProductRequest): UpdateProductDto => {
    const today = getTodayDateISO()

    return {
        code: dto.productCode ? Number(dto.productCode) : undefined,
        name: dto.name,
        description: dto.description,
        observation: dto.observation ?? null,
        registration_date: dto.registrationDate,
        physical_condition: dto.physicalCondition as ProductCondition,
        category: dto.category as ProductCategory,
        updated_at: today,
    };
};

export const mapTransferProductRequestToDto = (dto: TransferProductRequest, productId: number, destinationDepartmentId: number): TransferProductDto => {

    const today = getTodayDateISO()
    return {
        p_product_id: productId,
        p_destination_department_id: destinationDepartmentId,
        p_date: dto.transferDate ?? today,
        p_reason: dto.reasonForMovement,
    };

}

export const mapUnusuableProductRequesToDto = (dto: MarkProductUnusableRequest): UnusableProductDto => {
    return {
        unusableReason: dto.unusableReason,
        physicalCondition: dto.physicalCondition as ProductCondition
    }
}

export const mapRepairProductRequestToDto = (dto: RepairProductRequest, productId: number): RepairProductDto => {

    const today = getTodayDateISO()

    return {
        p_product_id: productId,
        p_physical_condition: dto.physicalCondition,
        p_repair_description: dto.repairDescription,
        p_cost: dto.cost ? Number(dto.cost) : null,
        p_repair_date: dto.repairDate || today,
    };
}

export const mapMarkProductAsLostToDto = (dto: LostProductRequest, productId: number): LostProductDto => {

    const today = getTodayDateISO()

    return {
        p_product_id: productId,
        p_complaint_reference: dto.complaintReference,
        p_date: dto.lossDate || today,
        p_type: dto.lossType,
        p_details: dto.lossDetails || "",
    };
}

export const mapRetireProductToDto = (dto: RetireProductRequest, productId: number): RetireProductDto => {
    const today = getTodayDateISO()

    return {
        p_product_id: productId,
        p_doc_reference: dto.documentReference,
        p_reason: dto.unusableReason,
        p_date: dto.retirementDate || today,
        p_type: dto.retirementType,
    };
}