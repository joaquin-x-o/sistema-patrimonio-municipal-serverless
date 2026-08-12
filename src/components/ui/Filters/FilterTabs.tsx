import type { TabOption } from "../../../interfaces/TapOption";



interface Props {
    tabs: TabOption[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

// componente de las pestañas para filtrar los productos en revisión
export function FilterTabs({ tabs, activeTab, onChange }: Props) {
    return (
        <div className="flex items-center justify-start md:justify-center gap-2 md:gap-6 bg-foreground border border-neutral rounded-full px-6 py-1 w-full max-w-4xl mx-auto overflow-x-auto [&::-webkit-scrollbar]:hidden">

            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className="relative flex items-center gap-2 px-2 py-3 whitespace-nowrap group transition-all cursor-pointer"
                    >
                        {/* punto que se enciende al seleccionar la opcion */}
                        <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${isActive ? tab.dotColor : "bg-slate-300"
                            }`}></span>

                        {/* nombre del tab */}
                        <span className={`text-[15px] transition-colors duration-300 ${isActive
                            ? "text-foreground-muted font-bold"
                            : "text-foreground-muted"
                            }`}>
                            {tab.label} ({tab.count})
                        </span>

                        {/* linea inferior que indica el tab activo */}
                        {isActive && (
                            <span className="absolute bottom-2 left-0 right-0 h-0.5 bg-primary-hover"></span>
                        )}
                    </button>
                );
            })}

        </div>
    );
}