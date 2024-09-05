"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SignUp() {
    const { toast } = useToast()
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateField = (name: string, value: string) => {
        let error = ""
        if (value.trim() === "") {
            error = `El campo ${name} es requerido`
        } else if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                error = "Por favor, ingrese un correo electrónico válido"
            }
        }
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        validateField(name, value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let isValid = true
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key as keyof typeof formData])
            if (errors[key as keyof typeof errors] !== "") {
                isValid = false
            }
        })
        if (isValid) {
            setIsSubmitting(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-user`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                })

                if (response.ok) {
                    toast({
                        title: "Registro exitoso",
                        description: "Por favor, verifica tu correo electrónico.",
                    })
                    // Almacenar el correo en localStorage y redirigir a la página de verificación
                    localStorage.setItem('email', formData.email)
                    router.push('/verify-code')
                } else {
                    const errorData = await response.json()
                    toast({
                        title: "Error en el registro",
                        description: errorData.message || "Hubo un problema al crear tu cuenta. Por favor, intenta de nuevo.",
                        variant: "destructive",
                    })
                }
            } catch (error) {
                toast({
                    title: "Error de conexión",
                    description: "No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.",
                    variant: "destructive",
                })
            } finally {
                setIsSubmitting(false)
            }
        } else {
            toast({
                title: "Formulario incompleto",
                description: "Por favor, completa todos los campos correctamente.",
                variant: "destructive",
            })
        }
    }

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword)
        }

        return (
            <body>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Crear cuenta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Ingrese su nombre"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={errors.name ? "border-red-500" : ""}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="lastName">Apellido</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Ingrese su apellido"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={errors.lastName ? "border-red-500" : ""}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder="correo@ejemplo.com"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Ingrese su contraseña"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={errors.password ? "border-red-500" : ""}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={togglePasswordVisibility}
                                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                    </div>
                                </div>
                                <Button className="w-full mt-6" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Registrando..." : "Registrarse"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <p className="text-sm text-center text-gray-600">
                                ¿Ya tienes una cuenta?{" "}
                                <Link href="/signin" className="text-blue-600 hover:underline">
                                    Iniciar sesión
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
                <Toaster />
            </body>
        )
    }