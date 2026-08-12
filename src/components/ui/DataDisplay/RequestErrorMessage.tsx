import { AlertCircle } from "lucide-react";

interface Props {
    message: string;
}

export function RequestErrorMessage({ message }: Props) {
    return (
        <div className="flex items-center gap-2 mt-5 p-3 text-sm text-danger bg-red-50 border border-danger rounded-md">
            <AlertCircle size={18} className="shrink-0" />
            <p>{message}</p>
        </div>
    )
}