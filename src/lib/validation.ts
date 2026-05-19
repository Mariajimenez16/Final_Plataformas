export interface ValidationError {
  field: string;
  message: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
}

export function validateProduct(data: Partial<ProductData>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'El nombre debe tener al menos 3 caracteres' });
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'La descripción debe tener al menos 10 caracteres' });
  }

  if (!data.price || data.price <= 0) {
    errors.push({ field: 'price', message: 'El precio debe ser mayor a 0' });
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'La categoría es requerida' });
  }

  if (data.stock === undefined || data.stock < 0) {
    errors.push({ field: 'stock', message: 'El stock no puede ser negativo' });
  }

  return errors;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (password.length < 8) {
    errors.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres' });
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({ field: 'password', message: 'Debe contener al menos una mayúscula' });
  }

  if (!/[0-9]/.test(password)) {
    errors.push({ field: 'password', message: 'Debe contener al menos un número' });
  }

  return errors;
}
