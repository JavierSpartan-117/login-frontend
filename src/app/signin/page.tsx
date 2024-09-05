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

export default function Login() {
    const { toast } = useToast()
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast({
                    title: "Inicio de sesión exitoso",
                    description: "Por favor, verifica tu correo electrónico.",
                })
                localStorage.setItem('email', formData.email)
                router.push('/verify-code')
            } else {
                const errorData = await response.json()
                toast({
                    title: "Error de inicio de sesión",
                    description: errorData.message || "Credenciales incorrectas. Por favor, intenta de nuevo.",
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
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <body>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
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
                                            required
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
                                </div>
                            </div>
                            <Button className="w-full mt-6" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <p className="text-sm text-center text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/signup" className="text-blue-600 hover:underline">
                                Regístrate
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
            <Toaster />
        </body>
    )
}