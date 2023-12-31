import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { AxiosError } from "axios";
import { IconsModule } from "../../icons/icons.module";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../services";

@Component({
  selector: "pb-login",
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
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.formGroup = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  async goBack() {
    if (this.activatedRoute.snapshot.queryParams["redirect"]) {
      try {
        this.router.navigate([
          this.router.parseUrl(
            this.activatedRoute.snapshot.queryParams["redirect"],
          ),
        ]);
      } catch (e) {
        this.router.navigate(["/"]);
      }
    } else {
      if (this.router.navigated) {
        this.location.back();
      } else {
        this.router.navigate(["/"]);
      }
    }
  }

  async login(e: SubmitEvent) {
    e.preventDefault();
    if (this.submitting || !this.formGroup.valid) return;

    this.submitting = true;
    const { email, password } = this.formGroup.value;
    try {
      await this.authService.login(email, password);
      this.goBack();
    } catch (e) {
      this.errorMessage = (e as AxiosError).response?.data as string;
    } finally {
      this.submitting = false;
    }
  }
}
