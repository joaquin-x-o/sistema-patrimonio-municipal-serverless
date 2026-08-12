// CATEGORIA
export const ProductCategory = {
    // Básicos de oficina
    FURNITURE: 'FURNITURE',
    IT: 'IT',
    OFFICE_EQUIPMENT: 'OFFICE_EQUIPMENT',

    // Tecnología específica
    ELECTRONICS: 'ELECTRONICS',

    // Trabajo pesado y mantenimiento
    TOOLS: 'TOOLS',
    MACHINERY: 'MACHINERY',
    VEHICLES: 'VEHICLES',

    // Deporte y Cultura
    SPORTS: 'SPORTS',
    CULTURE: 'CULTURE',
    EDUCATION: 'EDUCATION',

    // Infraestructura y Edificio
    URBAN_ELEMENTS: 'URBAN_ELEMENTS',
    INSTALLATIONS: 'INSTALLATIONS',

    // Decoración
    TEXTILES: 'TEXTILES',
    ARTWORK: 'ARTWORK',

    // Varios
    SAFETY: 'SAFETY',
    APPLIANCES: 'APPLIANCES',
    KITCHENWARE: 'KITCHENWARE',

    OTHER: 'OTHER'
} as const;

export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory];


// CONDICION FISICA
export const ProductCondition = {
    NEW: 'NEW',
    EXCELLENT: 'EXCELLENT',
    GOOD: 'GOOD',
    REGULAR: 'REGULAR',
    BAD: 'BAD',
    BROKEN: 'BROKEN'
} as const;

export type ProductCondition = typeof ProductCondition[keyof typeof ProductCondition];


// ESTADO
export const ProductStatus = {
    ACTIVE: 'ACTIVE',
    UNUSABLE: 'UNUSABLE',
    IN_REVIEW: 'IN_REVIEW',
    LOST: 'LOST',
    RETIRED: 'RETIRED'
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

// check review se considera un estado de producto más (se lo se separa ya que un producto en check review puede tener otro estado a su vez)
export type ProductFilterTab = ProductStatus | 'CHECK_REVIEW';