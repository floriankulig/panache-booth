import { Location } from "@angular/common";
import { Component, Output } from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControlOptions,
} from "@angular/forms";
import { PositiveNumberDirective } from "../../directives/positive-number.directive";
import { RouterModule } from "@angular/router";
import { Address } from "../../../ts";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    IconsModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PositiveNumberDirective,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  submitting = false;
  errorMessage = "";
  formStep = 1;
  formGroup: FormGroup;

  steps = [
    this.formBuilder.group(
      {
        username: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: this.customValidators,
      } as AbstractControlOptions,
    ),
    this.formBuilder.group({
      street: ["", Validators.required],
      houseNumber: ["", Validators.required],
      postcode: ["", Validators.required],
      city: ["", Validators.required],
    }),
  ];

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.formGroup = this.steps[this.formStep - 1];
  }

  get primaryText() {
    return this.formStep < 2
      ? "Next Step"
      : this.submitting
      ? "lädt..."
      : "Sign Up";
  }

  back() {
    if (this.formStep > 1) {
      this.formStep--;
      this.formGroup = this.steps[this.formStep - 1];
    } else {
      this.location.back();
    }
  }

  confirm(event?: SubmitEvent) {
    event?.preventDefault();
    this.errorMessage = "";
    this.submitting = false;
    console.log(this.formGroup.controls);
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    if (this.formStep < 2) {
      this.formStep++;
      this.formGroup = this.steps[this.formStep - 1];
    } else {
      this.submit();
    }
  }

  async submit() {
    this.submitting = true;
    const { username, email, password } = this.steps[0].value as {
      [key: string]: string;
    };
    const address = this.steps[1].value as Address;
    const user = { username, email, password, address };
    console.log(user);
  }

  customValidators(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;
    if (password !== confirmPassword) {
      formGroup.get("confirmPassword")?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get("confirmPassword")?.setErrors(null);
    }
  }
}
