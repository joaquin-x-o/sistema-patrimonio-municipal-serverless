import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

interface MenuItem {
    label: string;
    to: string;
    danger?: boolean;
}

interface Props {
    name: string;
    label: string;
    icon: React.ElementType;
    items: MenuItem[];
}

export function SidebarMenu({ name, label, icon: Icon, items, }: Props) {
    return (
        <Sidebar.Item name={name}>
            {() => (
                <>
                    <Sidebar.Trigger
                        name={name}
                        icon={<Icon size={22} />}
                    >
                        {label}
                    </Sidebar.Trigger>

                    <Sidebar.Content name={name}>
                        {items.map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`hover:underline ${item.danger ? "hover:text-danger" : ""
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </Sidebar.Content>
                </>
            )}
        </Sidebar.Item>
    );
}