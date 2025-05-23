import { ChangeDetectionStrategy, Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-auth',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class AuthComponent implements OnInit, OnDestroy {

  private readonly _destroy$ = new Subject<void>();

  public readonly formGroup = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  public errorSignals = signal('')

  public ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        tap(() => {
          const loginInvalid = this.formGroup.controls.login.invalid
          const passwordInvalid = this.formGroup.controls.password.invalid
          this.errorSignals.set(
            loginInvalid && passwordInvalid ? 'Логин и пароль не введен' :
              loginInvalid ? 'Логин не введен' :
                passwordInvalid ? 'Пароль не введен' :
                  ''
          );
        }),
        takeUntil(this._destroy$)
      )
      .subscribe()
  }

  public ngOnDestroy(): void {
    this._destroy$.next()
    this._destroy$.complete()
  }

  public login(): void {
    console.log(this.formGroup.controls);
  }

}
