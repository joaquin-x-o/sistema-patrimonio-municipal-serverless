import { getTodayDate } from "./getTodayDate";

// comparacion de una fecha con respecto a la actual en dias
export const getDayDifference = (date: string) => {
    const today = new Date(getTodayDate());
    const timeDifference = today.getTime() - new Date(date).getTime();

    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference
};