import { PageTitle } from "../ui/Typography/PageTitle";

interface Props {
    title: string;
    children: React.ReactNode;
}

export function FormLayout({ title, children }: Props) {
    return (
        <div className="flex flex-col gap-8">
            <PageTitle title={title} />
            {children}
        </div>
    );
}