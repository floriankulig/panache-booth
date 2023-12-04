import { Component, OnInit } from "@angular/core";
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
  selector: "app-login",
  standalone: true,
  imports: [RouterModule, IconsModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
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

  ngOnInit() {
    if (!!this.authService.isLoggedIn()) {
      this.router.navigate(["/"]);
    }
  }

  goBack() {
    if (
      window.history.length > 1 ||
      this.activatedRoute.snapshot.queryParams["redirect"]
    ) {
      this.location.back();
    } else {
      this.router.navigate(["/"]);
    }
  }

  async login(e: SubmitEvent) {
    e.preventDefault();
    if (this.submitting || !this.formGroup.valid) return;
    console.log(this.formGroup.value);

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
