'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { saveCategory } from '../actions';
import { useRouter } from 'next/navigation';

const COLORS = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Amarillo', value: '#F59E0B' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Gris', value: '#6B7280' }
];

const ICONS = ['🍔', '🚗', '⚡', '🎮', '❤️', '📚', '🏠', '📦', '💰', '🎬', '🏋️', '✈️'];

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState('📦');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('color', selectedColor);
    formData.set('icon', selectedIcon);

    const result = await saveCategory(formData);

    if (result?.error) {
      alert(result.error);
    } else {
      setOpen(false);
      router.refresh();
      // Reset form
      e.currentTarget.reset();
      setSelectedColor(COLORS[0].value);
      setSelectedIcon('📦');
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          <DialogDescription>
            Crea una categoría para organizar tus gastos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="ej. Alimentos"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-10 rounded-md border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-foreground scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Icono</Label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-10 rounded-md border-2 text-2xl transition-all ${
                    selectedIcon === icon
                      ? 'border-foreground bg-accent scale-110'
                      : 'border-transparent hover:bg-accent/50 hover:scale-105'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe esta categoría..."
              rows={3}
            />
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-2">Vista previa:</p>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white"
              style={{ backgroundColor: selectedColor }}
            >
              <span className="text-xl">{selectedIcon}</span>
              <span>Categoría</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
