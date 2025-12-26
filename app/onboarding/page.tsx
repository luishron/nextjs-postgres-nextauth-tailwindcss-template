'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { saveOnboardingName, saveCategory, savePaymentMethod, finishOnboarding } from '../dashboard/actions';
import {
  Wallet,
  User,
  Tag,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

type OnboardingStep = 1 | 2 | 3 | 4;

const CATEGORY_SUGGESTIONS = [
  { name: 'Alimentos', color: '#10B981', icon: 'Utensils' },
  { name: 'Transporte', color: '#3B82F6', icon: 'Car' },
  { name: 'Entretenimiento', color: '#F59E0B', icon: 'Film' },
  { name: 'Servicios', color: '#8B5CF6', icon: 'Zap' },
  { name: 'Salud', color: '#EF4444', icon: 'Heart' },
  { name: 'Educación', color: '#6366F1', icon: 'GraduationCap' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Name
  const [fullName, setFullName] = useState('');

  // Step 2: Categories (selected from suggestions)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Step 3: Payment Method
  const [paymentName, setPaymentName] = useState('');
  const [paymentType, setPaymentType] = useState<'tarjeta_credito' | 'tarjeta_debito' | 'efectivo'>('tarjeta_credito');

  const handleNextStep = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (step === 1) {
        // Save name
        const formData = new FormData();
        formData.append('fullName', fullName);
        const result = await saveOnboardingName(formData);

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        setStep(2);
      } else if (step === 2) {
        // Create selected categories
        for (const categoryName of selectedCategories) {
          const category = CATEGORY_SUGGESTIONS.find(c => c.name === categoryName);
          if (category) {
            const formData = new FormData();
            formData.append('name', category.name);
            formData.append('color', category.color);
            formData.append('icon', category.icon);
            await saveCategory(formData);
          }
        }
        setStep(3);
      } else if (step === 3) {
        // Create payment method
        const formData = new FormData();
        formData.append('name', paymentName);
        formData.append('type', paymentType);
        formData.append('color', '#9FFF66');
        formData.append('isDefault', 'true');

        const result = await savePaymentMethod(formData);

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        setStep(4);
      } else if (step === 4) {
        // Complete onboarding
        await finishOnboarding();
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as OnboardingStep);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const canContinue = () => {
    if (step === 1) return fullName.trim().length >= 2;
    if (step === 2) return selectedCategories.length > 0;
    if (step === 3) return paymentName.trim().length > 0;
    return true;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            {step === 1 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">¡Bienvenido a Gastos!</CardTitle>
                <CardDescription className="text-center text-base">
                  Empecemos configurando tu perfil
                </CardDescription>
              </>
            )}
            {step === 2 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <Tag className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">Categorías iniciales</CardTitle>
                <CardDescription className="text-center text-base">
                  Selecciona las categorías que más uses (puedes agregar más después)
                </CardDescription>
              </>
            )}
            {step === 3 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">Método de pago</CardTitle>
                <CardDescription className="text-center text-base">
                  Agrega tu método de pago principal
                </CardDescription>
              </>
            )}
            {step === 4 && (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/20">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">¡Todo listo!</CardTitle>
                <CardDescription className="text-center text-base">
                  Ya puedes empezar a gestionar tus finanzas
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base">
                    ¿Cómo te llamas?
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 text-base"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 2: Categories */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORY_SUGGESTIONS.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => toggleCategory(category.name)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                      selectedCategories.includes(category.name)
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Tag className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                    {selectedCategories.includes(category.name) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentName" className="text-base">
                    Nombre del método de pago
                  </Label>
                  <Input
                    id="paymentName"
                    type="text"
                    placeholder="Ej: Tarjeta principal, Efectivo, etc."
                    value={paymentName}
                    onChange={(e) => setPaymentName(e.target.value)}
                    className="h-11 text-base"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Tipo</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'tarjeta_credito' as const, label: 'Crédito', icon: CreditCard },
                      { value: 'tarjeta_debito' as const, label: 'Débito', icon: CreditCard },
                      { value: 'efectivo' as const, label: 'Efectivo', icon: Wallet },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setPaymentType(value)}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                          paymentType === value
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                            : 'border-border bg-background'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Completion */}
            {step === 4 && (
              <div className="space-y-6 text-center">
                <div className="rounded-lg bg-primary/5 p-6 space-y-2">
                  <p className="text-lg font-semibold">
                    ¡Hola, {fullName}!
                  </p>
                  <p className="text-muted-foreground">
                    Has configurado {selectedCategories.length} categorías y 1 método de pago.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Puedes personalizar todo desde el dashboard.
                  </p>
                </div>
                <div className="grid gap-3 text-left">
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Crea tu primer gasto</p>
                      <p className="text-sm text-muted-foreground">
                        Empieza a registrar tus gastos diarios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Ve tus estadísticas</p>
                      <p className="text-sm text-muted-foreground">
                        Analiza tus gastos con gráficas y métricas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Configura presupuestos</p>
                      <p className="text-sm text-muted-foreground">
                        Establece límites de gasto por categoría
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && step < 4 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="h-11"
                  disabled={isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
              <Button
                onClick={handleNextStep}
                className="h-11 flex-1 font-semibold"
                disabled={!canContinue() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Procesando...
                  </span>
                ) : step === 4 ? (
                  <span className="flex items-center gap-2">
                    Ir al Dashboard
                    <ChevronRight className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continuar
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        {step < 4 && (
          <p className="text-center text-sm text-muted-foreground">
            Paso {step} de 4 •{' '}
            <button
              onClick={() => setStep(4)}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Saltar configuración
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
