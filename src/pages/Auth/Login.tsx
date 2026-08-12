import { useState } from "react";
import type { LoginRequest } from "../../schemas/user.schemas";
import { LoginForm } from "../../components/features/auth/Form/LoginForm";
import { TestCredentialsModal } from "../../components/features/auth/TestCredentialsModal";
import { useSignIn } from "../../hooks/auth/useSignIn";


export default function Login() {

    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const { executeSignIn, loading, error, setError } = useSignIn();
    const [credentials, setCredentials] = useState<LoginRequest>();


    return (
        <div className="min-h-screen flex items-start justify-center bg-background p-4 pt-20 md:pt-32">
            <LoginForm
                isLoading={loading}
                loading={loading}
                serverError={error}
                helpText="Credenciales de prueba"
                onHelpClick={() => setIsGuideModalOpen(true)}
                externalValue={credentials}
                onSubmit={executeSignIn}
                onClear={() => setError(null)}
            />

            <TestCredentialsModal
                isOpen={isGuideModalOpen}
                onClose={() => setIsGuideModalOpen(false)}
                onSelect={(username, password) => {
                    setCredentials({ username, password });
                    setIsGuideModalOpen(false);
                }}
            />
        </div>
    );
}
