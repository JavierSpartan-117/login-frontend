"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/components/ui/toaster'

export default function VerifyCode() {
    const { toast } = useToast()
    const router = useRouter()
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [email, setEmail] = useState('')
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const storedEmail = localStorage.getItem('email')
        if (storedEmail) {
            setEmail(storedEmail)
        } else {
            // Redirigir al registro si no hay correo almacenado
            router.push('/signup')
        }
    }, [router])

    const handleChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newCode = [...code]
            newCode[index] = value
            setCode(newCode)

            // Mover al siguiente input si se ingresó un dígito
            if (value.length === 1 && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && index > 0 && code[index] === '') {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const verificationCode = code.join('')
        if (verificationCode.length !== 6) {
            toast({
                title: "Código incompleto",
                description: "Por favor, ingresa el código de 6 dígitos completo.",
                variant: "destructive",
            })
            return
        }

        try {
            const response = await fetch("http://localhost:4000/api/auth/verify-mfa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, mfaToken: verificationCode }),
            })

            if (response.ok) {
                toast({
                    title: "Verificación exitosa",
                    description: "Has iniciado sesión correctamente.",
                })
                localStorage.removeItem('email') // Limpiar el email almacenado
                router.push('/home') // Redirigir al dashboard o página principal
            } else {
                const errorData = await response.json()
                toast({
                    title: "Error de verificación",
                    description: errorData.message || "Código de verificación incorrecto. Por favor, intenta de nuevo.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error de conexión",
                description: "No se pudo conectar con el servidor. Por favor, verifica tu conexión e intenta de nuevo.",
                variant: "destructive",
            })
        }
    }

    return (
        <body>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Verificar Código</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between mb-6">
                                {code.map((digit, index) => (
                                    <Input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        ref={(input) => {
                                            inputRefs.current[index] = input
                                        }}
                                        className="w-12 h-12 text-center text-2xl"
                                    />
                                ))}
                            </div>
                            <Button className="w-full" type="submit">
                                Verificar
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-600">
                            ¿No recibiste el código? <Button variant="link" className="p-0">Reenviar</Button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
            <Toaster />
        </body>
    )
}