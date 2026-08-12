const normalizeForComparison = (value: unknown): string => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10);
    }
    return String(value);
};

export const buildLogDiff = (
    before: Record<string, any>,
    changes: Record<string, any>
): { oldData: Record<string, unknown>; newData: Record<string, unknown> } => {
    const oldData: Record<string, unknown> = {};
    const newData: Record<string, unknown> = {};

    for (const key in changes) {
        const newValue = changes[key];
        const isProvided = newValue !== undefined;
        if (!isProvided) continue;

        const oldValue = before[key];
        const hasChanged = normalizeForComparison(oldValue) !== normalizeForComparison(newValue);
        if (!hasChanged) continue;

        oldData[key] = oldValue;
        newData[key] = newValue;
    }

    return { oldData, newData };
};