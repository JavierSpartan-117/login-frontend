import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Bienvenido</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <p className="text-xl text-center mb-6">
                        ¡Gracias por unirte a nuestra plataforma!
                    </p>
                    <div className="relative w-72 h-96">
                        <Image
                            src="/stitch-png.png?height=256+&width=256"
                            alt="Imagen de bienvenida"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}