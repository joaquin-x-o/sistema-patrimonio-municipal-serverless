export function LoadingDots() {
    return (
        <div className="flex space-x-1 justify-center items-center h-full min-h-6">
            <div className="h-1.5 w-1.5 bg-foreground-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1.5 w-1.5 bg-foreground-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1.5 w-1.5 bg-foreground-muted rounded-full animate-bounce"></div>
        </div>
    );
}