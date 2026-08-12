import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Common/Card";
import { LinkButton } from "../../components/ui/Button/LinkButton";
import type { ProductLightResponse } from "../../interfaces/responses/productResponses";
import { SearchListFormat } from "../../components/ui/Search/SearchListFormat";
import { ModalSearchList } from "../../components/ui/Modals/ModalSearchList";
import { ReportSearchCard } from "../../components/ui/Cards/ReportSearchCard";
import { PageTitle } from "../../components/ui/Typography/PageTitle";
import { useReportProductLists } from "../../hooks/query/reports/useReportProductLists";
import { useAuth } from "../../hooks/auth/useAuth";
import { UserRole } from "../../types/user.type";

export default function ReportManagement() {
    const navigate = useNavigate();

    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    const [maintenanceCode, setMaintenanceCode] = useState("");
    const [transferCode, setTransferCode] = useState("");
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const { maintenanceList, movementList } = useReportProductLists();

    const maintenanceReportList = maintenanceList;
    const transferReportList = movementList;


    // handlers para los reportes de mantenimiento y traslado
    const handleMaintenanceInput = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = maintenanceCode.trim();
        if (code) navigate(`/reportes/mantenimiento/${code}`);
    };

    const handleTransferInput = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = transferCode.trim();
        if (code) navigate(`/reportes/traslados/${code}`);
    };

    // reportes disponibles
    const reportCards = [
        {
            title: "Reporte de mantenimiento",
            value: maintenanceCode,
            onChange: setMaintenanceCode,
            onSubmit: handleMaintenanceInput,
            onOpenModal: () => setIsMaintenanceModalOpen(true),
        },
        {
            title: "Reporte de traslado",
            value: transferCode,
            onChange: setTransferCode,
            onSubmit: handleTransferInput,
            onOpenModal: () => setIsTransferModalOpen(true),
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            <PageTitle title="Gestión de Reportes" />

            {/* Reportes de mantenimiento y traslado */}
            <div className="grid grid-cols-1 gap-6">
                {reportCards.map((card) => (
                    <ReportSearchCard
                        key={card.title}
                        title={card.title}
                        value={card.value}
                        onChange={card.onChange}
                        onSubmit={card.onSubmit}
                        onOpenModal={card.onOpenModal}
                    />
                ))}

                {/* Productos perdidos */}
                <Card title="Reporte de productos perdidos">
                    <div className="flex flex-row gap-5">
                        <LinkButton className="text-sm" to="/reportes/perdidas">
                            Ver reporte
                        </LinkButton>
                    </div>

                </Card>

                {/* Productos dados de baja */}
                <Card title="Reporte de productos dados de baja">
                    <div className="flex flex-row gap-5">
                        <LinkButton className="text-sm" to="/reportes/bajas">
                            Ver reporte
                        </LinkButton>
                    </div>

                </Card>


                {/* Auditoria general (logs) */}
                {isAdmin && (
                    <Card title="Auditoría general">
                        <div className="flex flex-row gap-5">
                            <LinkButton
                                className="text-sm"
                                to="/reportes/auditoria"
                            >
                                Ver auditoría
                            </LinkButton>
                        </div>
                    </Card>
                )}
            </div>

            {/* MODAL PARA MANTENIMIENTO */}
            <ModalSearchList<ProductLightResponse>
                isOpen={isMaintenanceModalOpen}
                onClose={() => setIsMaintenanceModalOpen(false)}
                title="Seleccionar producto para ver su reporte"
                items={maintenanceReportList ?? []}
                getKey={(product) => product.productCode}
                getSearchText={(product) => `${product.name} ${product.productCode}`}
                onSelect={(product) => setMaintenanceCode(product.productCode.toString())}
            >
                {(product: ProductLightResponse) => <SearchListFormat name={product.name} code={product.productCode} />}
            </ModalSearchList>

            {/* MODAL PARA TRASLADOS */}
            <ModalSearchList<ProductLightResponse>
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                title="Seleccionar producto para ver su reporte"
                items={transferReportList ?? []}
                getKey={(product) => product.productCode}
                getSearchText={(product) => `${product.name} ${product.productCode}`}
                onSelect={(product) => setTransferCode(product.productCode.toString())}
            >
                {(product: ProductLightResponse) => <SearchListFormat name={product.name} code={product.productCode} />}
            </ModalSearchList>
        </div>
    );
}