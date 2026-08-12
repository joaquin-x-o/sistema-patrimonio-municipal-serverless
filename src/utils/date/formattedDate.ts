// conversion de fecha universal (YYYY/MM/DD) a fecha local (DD/MM/YYYY)
export function formatDateAR(dateString: string | null | undefined): string {
    if (!dateString) return 'Fecha desconocida';

    // conversion de fecha a local
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
}

// conversión de timestamp a fecha y hora local (DD/MM/YYYY HH:mm)
export function formatDateTimeAR(dateString: string | null | undefined): string {
    if (!dateString) return "Fecha desconocida";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    const formattedHours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${period}`;
}

// conversion de fecha con hora a fecha adaptable para ser recibido por el input date
export const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";

    // conversion de fecha a local
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`; // Formato obligatorio para <input type="date">
};

// idem para el input date, version calendario (registrationDate)
export const formatCalendarDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${year}-${month}-${day}`;
};

// para fechas puras de calendario (registration_date, date_unusable, etc.) guardadas a medianoche UTC
export function formatCalendarDateAR(dateString: string | null | undefined): string {
    if (!dateString) return 'Fecha desconocida';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}