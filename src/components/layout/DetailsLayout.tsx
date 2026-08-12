import { PageTitle } from "../ui/Typography/PageTitle";

interface Props {
    title: string;
    sections: React.ReactNode[];
    extra?: React.ReactNode;
    floatingAction?: React.ReactNode;
}

// Layout para las paginas de detalles, incluyendo reportes
export function DetailsLayout({
    title,
    sections,
    extra,
    floatingAction
}: Props) {
    return (
        <div className="flex flex-col gap-6 relative pb-20">
            <PageTitle title={title} />

            {sections.map((section, i) => (
                <div key={i}>{section}</div>
            ))}

            {extra}

            {floatingAction}
        </div>
    );
}