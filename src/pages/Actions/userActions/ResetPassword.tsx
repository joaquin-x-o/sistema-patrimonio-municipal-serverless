// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { ResetPasswordForm } from "../../../components/features/users/forms/ResetPasswordForm";
// import { RequestErrorMessage } from "../../../components/ui/DataDisplay/RequestErrorMessage";
// import { SuccessfulCard } from "../../../components/ui/Cards/SuccessfulCard";
// import { FormLayout } from "../../../components/layout/FormLayout";

// // NOTA: la funcionalidad de reset password no es funcional aún
// export default function ResetPassword() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // se obtiene el username que se manda desde UserDetails
//     const targetUsername = location.state?.username;

//     const [currentStep, setCurrentStep] = useState<"FORM" | "SUCCESS">("FORM");
//     const [error, setError] = useState<string | null>(null);

//     // si alguien entra a la URL directamente sin pasar por UserDetails, se lo retorna al panel de gestion
//     useEffect(() => {
//         if (!targetUsername) {
//             navigate("/usuario/gestion-usuarios");
//         }
//     }, [targetUsername, navigate]);

//     if (!targetUsername) return null;

//     return (
//         <FormLayout title="Gestión de usuarios">

//             {currentStep === "FORM" && (
//                 <StepLayout variant= "search">
//                     <ResetPasswordForm
//                         userData={{ username: targetUsername }}
//                         onSuccess={() => setCurrentStep("SUCCESS")}
//                         onBack={() => navigate(-1)}
//                         onError={(err) => setError(err)}
//                     />

//                     {error && (
//                         <FormError ref={errorRef} message={error}/>
//                     )}
//                 </StepLayout>
//             )}

//             {currentStep === "SUCCESS" && (
//               <StepLayout variant= "success">
//                     <SuccessfulCard
//                         title="Contraseña reiniciada con éxito"
//                         onFinish={() => navigate("/")}
//                         footerLinkText="Ir a perfil del usuario"
//                         footerLinkTo={`/usuario/${targetUsername}`}
//                     >
//                     </SuccessfulCard>
//                 </StepLayout>
//             )}

//         </FormLayout>
//     );
// }