import { PageTitle } from "../ui/Typography/PageTitle";

interface Props {
    title: string;
    topSection?: React.ReactNode;
    sideSection?: React.ReactNode;
    content: React.ReactNode;
    floatingAction?: React.ReactNode;
};

// Layout para las paginas de gestion
export function ManagementLayout({
    title,
    topSection,
    sideSection,
    content,
    floatingAction
}: Props) {
    return (
        <div className="flex flex-col gap-8">

            <PageTitle title={title} />

            {(topSection || sideSection) && (
                <div className={`grid grid-cols-1 gap-6 ${topSection && sideSection ? 'lg:grid-cols-3' : ''}`}>
                    {topSection && (
                        <div className={topSection && sideSection ? 'lg:col-span-2' : 'lg:col-span-3'}>
                            {topSection}
                        </div>
                    )}
                    {sideSection && (
                        <div className={topSection ? '' : 'lg:col-span-3'}>
                            {sideSection}
                        </div>
                    )}
                </div>
            )}

            {content}

            {floatingAction}

        </div>
    );
}