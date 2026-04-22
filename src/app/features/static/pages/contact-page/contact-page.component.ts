import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject, signal } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  imports: [TranslateModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-14 max-w-2xl">
      <h1 class="text-3xl font-bold mb-2">{{ 'static.contact.title' | translate }}</h1>
      <p class="text-muted-foreground mb-8">{{ 'static.contact.subtitle' | translate }}</p>

      @if (sent()) {
        <div class="py-10 text-center text-green-600 border border-green-200 rounded-xl bg-green-50">
          <p class="text-lg font-medium">{{ 'static.contact.thankYou' | translate }}</p>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="send()" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'static.contact.firstName' | translate }}</mat-label>
              <input matInput formControlName="firstName" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'static.contact.lastName' | translate }}</mat-label>
              <input matInput formControlName="lastName" />
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'static.contact.email' | translate }}</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'static.contact.subject' | translate }}</mat-label>
            <input matInput formControlName="subject" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'static.contact.message' | translate }}</mat-label>
            <textarea matInput rows="5" formControlName="message"></textarea>
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
            {{ 'static.contact.send' | translate }}
          </button>
        </form>
      }
    </div>
  `,
})
export class ContactPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly sent = signal(false);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  send(): void {
    if (this.form.valid) this.sent.set(true);
  }
}
