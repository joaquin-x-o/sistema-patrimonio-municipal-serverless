import { type ReactNode } from "react";

interface Props {
    input: ReactNode;
    action: ReactNode;
}

export function InputWithAction({ input, action }: Props) {
    return (
        <div className="flex gap-2 items-start w-full">
            <div className="flex-1">
                {input}
            </div>
            {action}
        </div>
    );
}