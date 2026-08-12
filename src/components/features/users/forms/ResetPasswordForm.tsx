// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { resetPasswordSchema, type ResetPasswordRequest } from "../../../../schemas/user.schemas";
// import { resetPassword } from "../../../../services/users/user.service.mock";
// import { Form } from "../../../ui/Forms/Form";
// import { FormField } from "../../../ui/Forms/FormField";
// import { Input } from "../../../ui/Input/Input";
// import { Button } from "../../../ui/Common/Button";

// interface UsernameParam {
//     username: string;
// }

// interface Props {
//     userData: UsernameParam;
//     onSuccess: () => void;
//     onBack: () => void;
//     onError: (error: string | null) => void;
// }

// // NOTA: la funcionalidad de reset password no es funcional aún
// export function ResetPasswordForm({ userData, onSuccess, onBack, onError }: Props) {

//     const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ResetPasswordRequest>({
//         resolver: zodResolver(resetPasswordSchema),
//     });

//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const onSubmit = () => {
//         try {
//             onError(null);
//             resetPassword(userData.username);
//             onSuccess();
//         } catch (error: any) {
//             console.error("Error al reiniciar contraseña:", error);
//             onError(
//                 error.message ||
//                 "Ocurrió un error al intentar reiniciar la contraseña."
//             );
//         }
//     };

//     return (
//         <Form
//             title={`Reiniciar contraseña: ${userData.username}`}
//             submitText="Confirmar reset"
//             onSubmit={handleSubmit(onSubmit)}
//             onCancel={onBack}
//         >

//             <FormField label="Nueva contraseña">
//                 <div className="flex gap-2 items-start">
//                     <div className="flex-1">
//                         <Input
//                             {...register("newPassword")}
//                             type={showNewPassword ? "text" : "password"}
//                             error={errors.newPassword?.message}
//                             placeholder="••••••••"
//                         />
//                     </div>

//                     <Button
//                         type="button"
//                         variant="invisible"
//                         className="p-2 text-foreground-muted hover:text-primary transition-colors"
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                     >
//                         {showNewPassword
//                             ? <EyeOff size={20} />
//                             : <Eye size={20} />
//                         }
//                     </Button>
//                 </div>
//             </FormField>

//             <FormField label="Confirmar contraseña">

//                 <div className="flex gap-2 items-start">

//                     <div className="flex-1">
//                         <Input
//                             {...register("confirmPassword")}
//                             type={showConfirmPassword ? "text" : "password"}
//                             error={errors.confirmPassword?.message}
//                             placeholder="••••••••"
//                         />
//                     </div>

//                     <Button
//                         type="button"
//                         variant="invisible"
//                         className="p-2 text-foreground-muted hover:text-primary transition-colors"
//                         onClick={() =>
//                             setShowConfirmPassword(!showConfirmPassword)
//                         }
//                     >
//                         {showConfirmPassword
//                             ? <EyeOff size={20} />
//                             : <Eye size={20} />
//                         }
//                     </Button>
//                 </div>
//             </FormField>

//             {isDirty && (
//                 <div className="flex justify-end mt-2">
//                     <Button
//                         variant="outlinePrimary"
//                         className="text-sm"
//                         onClick={() => reset()}
//                     >
//                         Deshacer cambios
//                     </Button>
//                 </div>
//             )}
//         </Form>
//     );
// }