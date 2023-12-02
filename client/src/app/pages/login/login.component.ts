import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { IconsModule } from "../../icons/icons.module";
import { RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterModule, IconsModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  submitting = false;
  errorMessage = "";
  formGroup: FormGroup;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.formGroup = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  cancel() {
    this.location.back();
  }

  login(e: SubmitEvent) {
    e.preventDefault();
    if (this.submitting || !this.formGroup.valid) return;
    console.log(this.formGroup.value);
  }
}
