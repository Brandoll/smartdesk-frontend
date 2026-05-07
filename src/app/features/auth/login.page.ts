import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="bg-background min-h-screen flex items-center justify-center p-md relative overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div
          class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-surface-variant to-transparent blur-3xl"
        ></div>
        <div
          class="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-primary-fixed to-transparent blur-3xl"
        ></div>
      </div>

      <main
        class="w-full max-w-[420px] bg-surface-container-lowest rounded-xl z-10 p-lg md:p-xl relative border border-outline-variant/30 shadow-sm"
        style="box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03);"
      >
        <div class="flex flex-col items-center mb-xl">
          <img src="/SmartDesk.png" alt="SmartDesk Logo" class="w-16 h-16 object-contain mb-md" />
          <h1 class="font-h1 text-h1 text-on-surface text-center tracking-tight">SmartDesk</h1>
          <p class="font-body-md text-body-md text-on-surface-variant text-center mt-sm">Sistema de Gestión Interna</p>
        </div>

        <form class="flex flex-col gap-md" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="flex flex-col gap-xs">
            <label class="font-body-sm text-body-sm text-on-surface font-semibold" for="email">Correo Electrónico</label>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]"
                >mail</span
              >
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-md py-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                placeholder="nombre@empresa.com"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="flex flex-col gap-xs mt-sm">
            <div class="flex items-center justify-between">
              <label class="font-body-sm text-body-sm text-on-surface font-semibold" for="password">Contraseña</label>
              <a class="font-body-sm text-body-sm text-primary hover:text-on-primary-fixed-variant transition-colors" href="#">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]"
                >lock</span
              >
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-md py-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                placeholder="••••••••"
                autocomplete="current-password"
              />
            </div>
          </div>

          <button
            class="w-full bg-primary text-on-primary font-body-md text-body-md font-semibold rounded-lg py-sm mt-lg hover:bg-on-primary-fixed-variant transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest flex items-center justify-center gap-xs shadow-sm disabled:opacity-60"
            type="submit"
            [disabled]="form.invalid || submitting"
          >
            Iniciar sesión
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </form>

        <p *ngIf="error" class="mt-md text-body-sm font-body-sm text-error">{{ error }}</p>

        <div class="mt-xl text-center border-t border-outline-variant/30 pt-lg">
          <p class="font-body-sm text-body-sm text-on-surface-variant">
            ¿No tienes una cuenta?
            <a
              class="font-body-sm text-body-sm text-primary font-semibold hover:text-on-primary-fixed-variant transition-colors ml-xs"
              routerLink="/register"
              >Crear cuenta</a
            >
          </p>
        </div>
      </main>
    </div>
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = false;
  error: string | null = null;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.error = null;
    this.submitting = true;

    const payload = this.form.getRawValue() as { email: string; password: string };
    this.auth.login(payload).subscribe({
      next: () => this.router.navigateByUrl('/users'),
      error: (e) => {
        this.error = e instanceof Error ? e.message : 'Login failed';
        this.submitting = false;
      },
      complete: () => (this.submitting = false),
    });
  }
}

