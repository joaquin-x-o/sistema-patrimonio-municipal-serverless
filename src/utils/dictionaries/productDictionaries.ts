import { ProductStatus, ProductCategory, ProductCondition } from "../../types/product.type";

export const statusTranslations: Record<ProductStatus, string> = {
    [ProductStatus.ACTIVE]: "Activo",
    [ProductStatus.UNUSABLE]: "En desuso",
    [ProductStatus.IN_REVIEW]: "En revisión",
    [ProductStatus.LOST]: "Perdido",
    [ProductStatus.RETIRED]: "Baja",
};

export const conditionTranslations: Record<ProductCondition, string> = {
    [ProductCondition.NEW]: "Nuevo",
    [ProductCondition.EXCELLENT]: "Excelente",
    [ProductCondition.GOOD]: "Bueno",
    [ProductCondition.REGULAR]: "Regular",
    [ProductCondition.BAD]: "Malo",
    [ProductCondition.BROKEN]: "Roto",
};

export const categoryTranslations: Record<ProductCategory, string> = {
    [ProductCategory.FURNITURE]: "Mobiliario",
    [ProductCategory.IT]: "Informática",
    [ProductCategory.OFFICE_EQUIPMENT]: "Eq. de Oficina",
    [ProductCategory.ELECTRONICS]: "Electrónica",
    [ProductCategory.TOOLS]: "Herramientas",
    [ProductCategory.MACHINERY]: "Maquinaria",
    [ProductCategory.VEHICLES]: "Vehículos",
    [ProductCategory.SPORTS]: "Deportes",
    [ProductCategory.CULTURE]: "Cultura",
    [ProductCategory.EDUCATION]: "Educación",
    [ProductCategory.URBAN_ELEMENTS]: "Elem. Urbanos",
    [ProductCategory.INSTALLATIONS]: "Instalaciones",
    [ProductCategory.TEXTILES]: "Textiles",
    [ProductCategory.ARTWORK]: "Obras de Arte",
    [ProductCategory.SAFETY]: "Seguridad",
    [ProductCategory.APPLIANCES]: "Electrodomésticos",
    [ProductCategory.KITCHENWARE]: "Cocina",
    [ProductCategory.OTHER]: "Otro"
};