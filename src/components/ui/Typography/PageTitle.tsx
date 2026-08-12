interface Props {
    title: string;
}

export function PageTitle({ title }: Props) {
    return (
        <h1 className="text-xl font-bold text-center uppercase tracking-widest text-primary">
            {title}
        </h1>
    );
}