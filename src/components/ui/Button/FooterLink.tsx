import { Link } from "react-router-dom";

interface Props {
    label: string;
    to?: string;
    onClick?: () => void;
}

export function FooterLink({ label, to, onClick }: Props) {
    const style = "text-sm text-primary-hover font-bold underline transition-all opacity-60 hover:opacity-100 cursor-pointer";

    // el FooterLink puede accionar como un link o bien como un botón, según el prop que se le pase
    if (to) {
        return <Link to={to} className={style}>{label}</Link>;
    }

    if (onClick) {
        return <button onClick={onClick} className={style}>{label}</button>;
    }

    return null;
}