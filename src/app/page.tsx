'use client'

import Head from "next/head"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Bienvenido</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-xl text-center mb-6">
            Elige una opción para continuar
          </p>
          <Link href="/signin" passHref className="w-full">
            <Button className="w-full" size="lg">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/signup" passHref className="w-full">
            <Button className="w-full" variant="outline" size="lg">
              Registrarse
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}