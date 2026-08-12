import { Card } from "../Common/Card";
import { LoadingContainer } from "../Feedback/LoadingContainer";

interface Props {
    title: string;
    children: React.ReactNode;
    loading?: boolean;
    footerLinkTo?: string;
}

// card que contiene un grafico de barras
export function BarGraphCard({ title, children, loading = false, footerLinkTo }: Props) {
    return (
        <Card title={title} footerLinkTo={footerLinkTo}>
            {loading ? (
                <LoadingContainer />
            ) : (
                <div className="flex flex-col gap-4 py-4">
                    {children}
                </div>
            )}
        </Card>
    );
}