'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { signInWithMagicLink } from '@/lib/auth-actions';
import { Mail, Sparkles, Wallet } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for errors from URL params
  const urlError = searchParams.get('error');

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithMagicLink(email);

      if (result.error) {
        setError(result.error);
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      setError('Error al enviar el enlace mágico');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 animate-fade-in">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              ¡Revisa tu email!
            </CardTitle>
            <CardDescription className="text-base">
              Te enviamos un enlace mágico a{' '}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Instrucciones:</strong>
              </p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Abre tu bandeja de entrada</li>
                <li>Busca el email de Gastos</li>
                <li>Haz clic en el enlace para iniciar sesión</li>
              </ol>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              Usar otro email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Branding */}
        <div className="text-center space-y-3 animate-slide-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Gastos
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestiona tus finanzas con inteligencia
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-2 animate-slide-in">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-base">
              Ingresa tu email y te enviaremos un enlace mágico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 text-base"
                  aria-describedby={error || urlError ? 'email-error' : undefined}
                />
              </div>

              {(error || urlError) && (
                <div
                  id="email-error"
                  role="alert"
                  className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error || (urlError === 'auth_error' && 'Error de autenticación. Intenta de nuevo.') || (urlError === 'profile_error' && 'Error al crear perfil. Contacta soporte.')}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Enviando enlace...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Enviar enlace mágico
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">
                ¿Qué es un enlace mágico?
              </p>
              <p>
                Es una forma segura de iniciar sesión sin contraseña. Solo haz
                clic en el enlace que te enviamos por email.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Al iniciar sesión, aceptas nuestros{' '}
          <a href="#" className="font-medium text-primary hover:underline">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="#" className="font-medium text-primary hover:underline">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
}
