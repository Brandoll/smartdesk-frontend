import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="bg-background min-h-screen flex items-center justify-center p-md sm:p-lg antialiased text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed"
    >
      <div
        class="w-full max-w-[1000px] bg-surface-container-lowest rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.05),_0px_1px_4px_rgba(0,0,0,0.05)] flex overflow-hidden border border-outline-variant/30"
      >
        <div class="hidden lg:flex lg:w-5/12 bg-surface-container-low flex-col justify-between p-xl relative border-r border-outline-variant/30">
          <div class="z-10">
            <div class="flex items-center gap-sm mb-xl">
              <img src="/SmartDesk.png" alt="SmartDesk Logo" class="w-8 h-8 object-contain" />
              <span class="font-h3 text-h3 text-on-surface tracking-tight font-black">SmartDesk</span>
            </div>
            <h1 class="font-h2 text-h2 text-on-surface mb-sm">Escala tu soporte de manera inteligente.</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">
              Únete a cientos de equipos que gestionan sus operaciones diarias con claridad y enfoque.
            </p>
          </div>
          <div class="z-10 mt-auto">
            <div class="flex items-center gap-sm mb-sm">
              <span class="material-symbols-outlined text-primary text-[16px]">check_circle</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Sin tarjeta de crédito requerida</span>
            </div>
            <div class="flex items-center gap-sm">
              <span class="material-symbols-outlined text-primary text-[16px]">check_circle</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Prueba gratuita de 14 días</span>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-7/12 p-lg sm:p-[48px] flex flex-col justify-center bg-surface-container-lowest">
          <div class="flex lg:hidden items-center gap-sm mb-lg">
            <img src="/SmartDesk.png" alt="SmartDesk Logo" class="w-8 h-8 object-contain" />
            <span class="font-h3 text-h3 text-on-surface tracking-tight font-black">SmartDesk</span>
          </div>

          <div class="mb-xl">
            <h2 class="font-h1 text-h1 text-on-surface mb-xs font-bold tracking-tight">Crear una cuenta</h2>
            <p class="font-body-lg text-body-lg text-on-surface-variant">Ingresa tus datos para comenzar.</p>
          </div>

          <form class="space-y-md" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div>
              <label class="block font-label-sm text-label-sm text-on-surface mb-xs" for="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-[12px] font-body-md text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-outline-variant"
                placeholder="Ej. Juan Pérez"
                autocomplete="name"
              />
            </div>

            <div>
              <label class="block font-label-sm text-label-sm text-on-surface mb-xs" for="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-[12px] font-body-md text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-outline-variant"
                placeholder="tu@empresa.com"
                autocomplete="email"
              />
            </div>

            <div>
              <label class="block font-label-sm text-label-sm text-on-surface mb-xs" for="password">Contraseña</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-[12px] font-body-md text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:border-outline-variant"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Mínimo 8 caracteres.</p>
            </div>

            <div class="pt-sm">
              <button
                class="w-full bg-[#F53D0A] text-on-primary font-body-lg text-body-lg font-semibold py-[14px] rounded-lg hover:bg-[#dd3200] hover:shadow-md transition-all flex justify-center items-center gap-sm shadow-sm disabled:opacity-60"
                type="submit"
                [disabled]="form.invalid || submitting"
              >
                Crear cuenta
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </form>

          <p *ngIf="error" class="mt-md text-body-sm font-body-sm text-error">{{ error }}</p>

          <div class="mt-xl text-center">
            <p class="font-body-md text-body-md text-on-surface-variant">
              ¿Ya tienes una cuenta?
              <a class="text-primary hover:text-primary-container font-semibold transition-colors hover:underline underline-offset-2" routerLink="/login"
                >Inicia sesión aquí</a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = false;
  error: string | null = null;

  readonly form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.error = null;
    this.submitting = true;

    const payload = this.form.getRawValue() as { name: string; email: string; password: string };

    this.auth.register(payload).subscribe({
      next: () => this.router.navigateByUrl('/users'),
      error: (e) => {
        this.error = e instanceof Error ? e.message : 'Register failed';
        this.submitting = false;
      },
      complete: () => (this.submitting = false),
    });
  }
}

