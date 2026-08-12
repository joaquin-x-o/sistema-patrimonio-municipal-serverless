import { LoadingDots } from "../DataDisplay/LoadingDots";

interface LoadingContainerProps {
    className?: string; // permite personalizar la altura u otras clases de estilo si es necesario. Por defecto, se centra verticalmente con "h-full".
}

// componente que indica que se está cargando información mediante el uso de LoadingDots
export const LoadingContainer = ({ className = "h-full", }: LoadingContainerProps) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <LoadingDots />
        </div>
    );
};