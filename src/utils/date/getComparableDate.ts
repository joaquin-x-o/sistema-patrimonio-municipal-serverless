// obtener un valor numerico comparable a partir de una fecha en formato ISO
export const getComparableDate = (date: string) => {

    const [year, month, day] = date.split("T")[0].split("-").map(Number);

    const dateValue = year * 10000 + month * 100 + day;
    return dateValue;
};