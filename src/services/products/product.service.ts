import type { ProductsParams } from "../../interfaces/params/productParams";
import type { ConditionCountResponse, ProductLightResponse } from "../../interfaces/responses/productResponses";
import { getLogDescription } from "../../lib/logMessage/logDescriptions";
import { mapCreateProductRequestToDto, mapMarkProductAsLostToDto, mapRepairProductRequestToDto, mapRetireProductToDto, mapTransferProductRequestToDto, mapUnusuableProductRequesToDto, mapUpdateProductRequestToDto } from "../../lib/maps/requests/productRequestMapper";
import { mapProductCountToConditionCountResponse, mapProductRowToFullResponse, mapProductRowToLightResponse, mapProductRowToShortResponse } from "../../lib/maps/responses/productResponseMapper";
import { getDepartmentId } from "../../repositories/departments/department.repository";
import { hasMaintenanceHistoryDb } from "../../repositories/maintenanceHistory/maintenanceHistory.repository";
import { hasMovementHistoryDb } from "../../repositories/movementHistory/movementHistory.repository";
import { approveReviewDb, checkProductExistenceDb, createProductDb, deleteProductDb, enableProductDb, getLastProductCodeDb, getProductByCodeDb, getProductCountByConditionDb, getProductId, getProductLastCheckDateDb, getProductListDb, getProductsByStatusDb, getProductsDb, getProductsLastCheckDateDb, getProductsNeedingCheckDb, getReviewCountsDb, markProductAsFoundDb, markProductAsLostDb, markProductUnusableDb, repairProductDb, retireProductDb, searchProductsLightDb, sendProductToReviewDb, transferProductDb, updateProductDb } from "../../repositories/products/products.repository";
import type { CreateProductRequest, LostProductRequest, MarkProductUnusableRequest, RepairProductRequest, RetireProductRequest, ReviewProductRequest, TransferProductRequest, UpdateProductRequest } from "../../schemas/product.schemas";
import { LogActionType, LogEntityType } from "../../types/log.type";
import { ProductStatus, type ProductFilterTab } from "../../types/product.type";
import { buildLogDiff } from "../../utils/logUtils/buildLogDiff";
import { shouldBeChecked } from "../../utils/product/shouldBeChecked";
import { getDepartmentByCode } from "../departments/department.service";
import { createLog } from "../logHistory/logHistory.service";
import { getLastProductLossReportDate } from "../lossHistory/lossHistory.service";

// CONSULTAS --------------

export const getProducts = async (params: ProductsParams = {}) => {
    const { page = 1, limit = 10 } = params;
    const { data, count } = await getProductsDb(params);

    // mapear los campos de la base de datos a la interfaz ProductShortResponse
    const products = (data ?? []).map(mapProductRowToShortResponse);

    return {
        data: products,
        total: count ?? 0,
        currentPage: page,
        totalPages: Math.ceil((count ?? 0) / limit)
    };
};


export const getProductList = async (): Promise<ProductLightResponse[]> => {
    const data = await getProductListDb();
    const products = (data ?? []).map(mapProductRowToLightResponse);

    return products;
};

// obtener producto por codigo
export const getProductByCode = async (productCode: string | undefined) => {
    if (!productCode) throw new Error("Código de producto no proporcionado.");

    const data = await getProductByCodeDb(Number(productCode));


    // mapear los campos de la base de datos a la interfaz ProductResponse
    const product = mapProductRowToFullResponse(data);

    return product;
};

// obtener conteo total de productos que necesitan revisión (IN_REVIEW + LOST + UNUSABLE + CHECK_REVIEW)
export const getTotalProductsToReview = async () => {
    const counts = await getReviewCounts();

    const totalToReview = Object.values(counts).reduce((total, count) => total + count, 0)

    return {
        total: totalToReview
    };
};

// obtener conteo de productos por cada estado de revisión
export const getReviewCounts = async () => {
    const [statusData, checkData] = await Promise.all([
        getReviewCountsDb(),
        getProductsLastCheckDateDb()
    ]);

    const checkReviewCount = checkData?.filter(p =>
        shouldBeChecked(p.last_check_date?.split('T')[0] ?? null)
    ).length ?? 0;

    return {
        [ProductStatus.IN_REVIEW]: statusData?.filter(p => p.status === 'IN_REVIEW').length ?? 0,
        [ProductStatus.LOST]: statusData?.filter(p => p.status === 'LOST').length ?? 0,
        [ProductStatus.UNUSABLE]: statusData?.filter(p => p.status === 'UNUSABLE').length ?? 0,
        CHECK_REVIEW: checkReviewCount
    };
};

// obtener producto segun estado (check_review es considerado un estado a nivel logica, no db)
//  'CHECK_REVIEW' = needsCheckReview (true)
export const getProductsByStatus = async (status: ProductFilterTab) => {
    const isCheckReview = status === 'CHECK_REVIEW';

    // si el estado es 'CHECK_REVIEW' se llama a su query especial. 
    const rawData = isCheckReview
        ? await getProductsNeedingCheckDb()
        : await getProductsByStatusDb(status);

    const products = (rawData ?? []).map(mapProductRowToShortResponse);

    return products;
};

// buscar producto
export const searchProductsLight = async (query: string): Promise<ProductLightResponse[]> => {
    if (!query.trim()) return [];

    const data = await searchProductsLightDb(query);

    const products = (data ?? []).map(mapProductRowToLightResponse);

    return products;
};

// generar codigo de producto
export const generateProductCode = async (): Promise<number> => {
    const lastCode = await getLastProductCodeDb();

    if (!lastCode) return 1;

    const generatedCode = lastCode + 1

    return generatedCode;
};

// saber si un producto tiene mantenimiento 
export const checkProductHasMaintenance = async (productCode: string): Promise<boolean> => {
    const productId = await getProductId(Number(productCode));

    const hasMaintenance = await hasMaintenanceHistoryDb(productId)

    return hasMaintenance;
};

// saber si un producto tiene traslados
export const checkProductHasMovements = async (productCode: string): Promise<boolean> => {
    const productId = await getProductId(Number(productCode));

    const hasMovement = await hasMovementHistoryDb(productId)

    return hasMovement;
};

// obtener conteo de productos segun condicion fisica
export const getProductCountByCondition = async (): Promise<ConditionCountResponse[]> => {
    const results = await getProductCountByConditionDb();

    const data = results.map(mapProductCountToConditionCountResponse)

    return data
};


// ACCIONES ---------------------

// crear producto
export const createProduct = async (userId: string, dto: CreateProductRequest) => {
    const departmentId = await getDepartmentId(dto.departmentCode);
    const product = mapCreateProductRequestToDto(dto, departmentId, userId);

    try {
        const created = await createProductDb(product);
        const response = mapProductRowToShortResponse(created);

        await createLog(userId, {
            action: LogActionType.CREATE_PRODUCT,
            entityType: LogEntityType.PRODUCT,
            entityCode: dto.productCode,
            description: getLogDescription(
                LogActionType.CREATE_PRODUCT,
                dto.productCode
            ),
            newData: {
                product: `${created.name} (COD. ${created.code})`
            }
        });

        return response;
    } catch (error: any) {
        if (error.code === "23505") {
            throw new Error("El código indicado ya está en uso.");
        }

        throw error;
    }
};

// actualizar producto
export const updateProduct = async (userId: string, productCode: number, request: UpdateProductRequest) => {
    const productId = await getProductId(productCode);

    const product = await getProductByCode(String(productCode));

    const dto = mapUpdateProductRequestToDto(request);

    try {
        const updatedProduct = await updateProductDb(productId, dto);
        const response = mapProductRowToShortResponse(updatedProduct);

        const { oldData, newData } = buildLogDiff(product, request);
        const hasChanges = Object.keys(newData).length > 0;

        if (hasChanges) {
            await createLog(userId, {
                action: LogActionType.EDIT_PRODUCT,
                entityType: LogEntityType.PRODUCT,
                entityCode: String(productCode),
                description: getLogDescription(LogActionType.EDIT_PRODUCT, String(productCode)),
                oldData,
                newData
            });
        }

        return response;
    } catch (error: any) {
        if (error.code === "23505") {
            throw new Error("El nuevo código indicado ya está en uso.");
        }
        throw error;
    }
};

// mandar producto a revision
export const reviewProduct = async (userId: string, productCode: string, request: ReviewProductRequest): Promise<boolean> => {

    const product = await getProductByCode(productCode);

    if (product.status === "IN_REVIEW") {
        throw new Error("El producto ya se encuentra en revisión.");
    }

    const productId = await getProductId(Number(productCode));

    const hasBeenReviewed = await sendProductToReviewDb(productId, request);

    if (hasBeenReviewed) {
        await createLog(userId, {
            action: LogActionType.REVIEW_PRODUCT,
            entityType: LogEntityType.PRODUCT,
            entityCode: productCode,
            description: getLogDescription(
                LogActionType.REVIEW_PRODUCT,
                productCode
            ),
            newData: {
                pendingReviewReason: request.pendingReviewReason
            }
        });
    }
    return hasBeenReviewed;
};

// aprobar revision
export const approveReview = async (userId: string, productCode: string): Promise<boolean> => {
    const product = await getProductByCode(productCode);

    if (product.status !== "IN_REVIEW") {
        throw new Error("El producto debe estar en revisión para poder aprobarlo.");
    }

    const productId = await getProductId(Number(productCode));

    const hasBeenApproved = await approveReviewDb(productId);

    if (hasBeenApproved) {
        await createLog(userId, {
            action: LogActionType.APPROVE_PRODUCT_REVIEW,
            entityType: LogEntityType.PRODUCT,
            entityCode: productCode,
            description: getLogDescription(
                LogActionType.APPROVE_PRODUCT_REVIEW,
                productCode
            ),
            oldData: {
                pendingReviewReason: product.pendingReviewReason
            }
        });
    }

    return hasBeenApproved;
};


// transferir producto
export const transferProduct = async (productCode: string, userId: string, request: TransferProductRequest) => {
    const product = await getProductByCode(productCode);
    const productId = await getProductId(Number(productCode));

    const originDepartment = product.department.departmentCode;
    const destinationDepartment = request.destinationDepartmentCode;

    const destinationDepartmentData = await getDepartmentByCode(destinationDepartment);

    if (originDepartment === destinationDepartment) {
        throw new Error("El producto ya se encuentra en el departamento indicado.");
    }

    const destinationDepartmentId = await getDepartmentId(destinationDepartment);
    const data = mapTransferProductRequestToDto(
        request,
        productId,
        destinationDepartmentId,
        userId
    );

    const updated = await transferProductDb(data);

    await createLog(userId, {
        action: LogActionType.TRANSFER_PRODUCT,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(
            LogActionType.TRANSFER_PRODUCT,
            productCode
        ),
        oldData: {
            department: `${product.department.name} (${product.department.departmentCode})`
        },
        newData: {
            department: `${destinationDepartmentData.name} (${destinationDepartment})`
        }
    });

    return mapProductRowToShortResponse(updated);
};

// marcar producto como averiado
export const markAsUnusable = async (userId: string, productCode: string, request: MarkProductUnusableRequest) => {
    const product = await getProductByCode(productCode);

    if (product.status === "UNUSABLE") {
        throw new Error("El producto ya se encuentra marcado en desuso.");
    }

    const productId = await getProductId(Number(productCode));
    const data = mapUnusuableProductRequesToDto(request);

    const updated = await markProductUnusableDb(productId, data);

    const response = mapProductRowToShortResponse(updated);

    await createLog(userId, {
        action: LogActionType.MARK_PRODUCT_AS_UNUSABLE,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(LogActionType.MARK_PRODUCT_AS_UNUSABLE, productCode),
        oldData: { status: product.status, physicalCondition: product.physicalCondition, },
        newData: {
            status: updated.status,
            unusableReason: request.unusableReason,
            physicalCondition: request.physicalCondition,
        }
    });

    return response;
};

// reparar producto
export const repairProduct = async (productCode: string, userId: string, request: RepairProductRequest) => {
    const product = await getProductByCode(productCode);

    if (product.status !== ProductStatus.UNUSABLE) {
        throw new Error(`El producto debe estar en desuso para realizar una reparación.`);
    }

    const productId = await getProductId(Number(productCode));
    const data = mapRepairProductRequestToDto(request, productId, userId);

    const updated = await repairProductDb(data);
    const response = mapProductRowToShortResponse(updated);

    await createLog(userId, {
        action: LogActionType.REPAIR_PRODUCT,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(LogActionType.REPAIR_PRODUCT, productCode),
        oldData: {
            unusableReason: product.unusableReason,
            physicalCondition: product.physicalCondition
        },
        newData: {
            repairDescription: request.repairDescription,
            physicalCondition: request.physicalCondition
        }
    });

    return response;
};

// marcar producto como perdido
export const markProductAsLost = async (productCode: string, userId: string, request: LostProductRequest) => {
    const product = await getProductByCode(productCode);

    if (product.status === "LOST") {
        throw new Error("El producto ya se encuentra registrado como extraviado.");
    }

    const productId = await getProductId(Number(productCode));
    const data = mapMarkProductAsLostToDto(request, productId, userId);

    const updated = await markProductAsLostDb(data);

    await createLog(userId, {
        action: LogActionType.MARK_PRODUCT_AS_LOST,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(
            LogActionType.MARK_PRODUCT_AS_LOST,
            productCode
        ),
        newData: {
            lossDate: request.lossDate
        }
    });

    return mapProductRowToShortResponse(updated);
};

// marcar producto como encontrado
export const markProductAsFound = async (userId: string, productCode: string): Promise<boolean> => {
    const product = await getProductByCode(productCode);

    if (product.status !== "LOST") {
        throw new Error("El producto no se encuentra registrado como extraviado.");
    }

    const productId = await getProductId(Number(productCode));
    const productLossDate = await getLastProductLossReportDate(productId);

    const updated = await markProductAsFoundDb(productId);

    await createLog(userId, {
        action: LogActionType.MARK_PRODUCT_AS_FOUND,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(
            LogActionType.MARK_PRODUCT_AS_FOUND,
            productCode
        ),
        oldData: {
            lossDate: productLossDate
        },
        newData: {
            foundDate: updated.status_updated_at
        }
    });

    return true;
};


// dar de baja producto
export const retireProduct = async (productCode: string, userId: string, request: RetireProductRequest) => {
    const product = await getProductByCode(productCode);

    if (product.status === "RETIRED") {
        throw new Error("El producto ya se encuentra dado de baja definitiva.");
    }

    const productId = await getProductId(Number(productCode));
    const data = mapRetireProductToDto(request, productId, userId);

    const updated = await retireProductDb(data);

    await createLog(userId, {
        action: LogActionType.RETIRE_PRODUCT,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(
            LogActionType.RETIRE_PRODUCT,
            productCode
        ),
        newData: {
            retirementDate: request.retirementDate
        }
    });

    return mapProductRowToShortResponse(updated);
};

// habilitar producto dado de baja
export const enableProduct = async (
    productCode: string,
    userId: string
): Promise<boolean> => {
    const product = await getProductByCode(productCode);

    if (product.status === ProductStatus.ACTIVE) {
        throw new Error("El producto ya se encuentra activo.");
    }

    const productId = await getProductId(Number(productCode));

    const updated = await enableProductDb(productId);

    await createLog(userId, {
        action: LogActionType.ENABLE_PRODUCT,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(
            LogActionType.ENABLE_PRODUCT,
            productCode
        ),
        oldData: {
            retirementDate: product.retirementDate
        },
        newData: {
            enabledDate: updated.status_updated_at
        }
    });

    return updated;
};


// constatar producto
export const checkProductExistence = async (userId: string, productCode: string): Promise<boolean> => {
    const productId = await getProductId(Number(productCode));

    const oldData = await getProductLastCheckDateDb(productId);
    const oldLastCheckDate = oldData?.last_check_date ?? null;

    const updated = await checkProductExistenceDb(productId);
    const newLastCheckDate = updated.last_check_date;

    await createLog(userId, {
        action: LogActionType.CHECK_PRODUCT,
        entityType: LogEntityType.PRODUCT,
        entityCode: productCode,
        description: getLogDescription(LogActionType.CHECK_PRODUCT, productCode),
        oldData: { lastCheckDate: oldLastCheckDate },
        newData: { lastCheckDate: newLastCheckDate }
    });

    return Boolean(updated);
};

// borrar producto (hard delete)
export const deleteProduct = async (userId: string, productCode: number) => {
    const product = await getProductByCode(String(productCode));

    const productId = await getProductId(productCode);

    try {
        await deleteProductDb(productId);

        await createLog(userId, {
            action: LogActionType.DELETE_PRODUCT,
            entityType: LogEntityType.PRODUCT,
            entityCode: String(productCode),
            description: getLogDescription(
                LogActionType.DELETE_PRODUCT,
                String(productCode)
            ),
            oldData: {
                product: `${product.name} (COD. ${product.productCode})`
            }
        });

        return true;
    } catch (error: any) {

        const errorMessage = error.message || "";

        if (errorMessage.includes("violates foreign key constraint") || error.code === "23503") {
            throw new Error(
                "No se puede eliminar el producto porque está asociado a otros registros."
            );
        }

        throw new Error(error.message);
    }
};