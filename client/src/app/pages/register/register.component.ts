import { Location } from "@angular/common";
import { AxiosError } from "axios";
import { Input, Component, OnInit } from "@angular/core";
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
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Address } from "../../../ts";
import { AuthService, RegisterUser } from "../../services";

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
export class RegisterComponent implements OnInit {
  @Input() formType: "vendor" | "customer" = "customer";
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.formGroup = this.steps[this.formStep - 1];
  }

  ngOnInit() {
    if (!!this.authService.isLoggedIn()) {
      this.router.navigate(["/"]);
    }
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
      this.locationBack();
    }
  }

  locationBack() {
    if (
      window.history.length > 1 ||
      this.activatedRoute.snapshot.queryParams["redirect"]
    ) {
      this.location.back();
    } else {
      this.router.navigate(["/"]);
    }
  }

  confirm(event?: SubmitEvent) {
    event?.preventDefault();
    this.errorMessage = "";
    this.submitting = false;
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
    const { postcode, houseNumber, ...address } = this.steps[1]
      .value as Address;
    const user: RegisterUser = {
      userName: username,
      email,
      password,
      houseNumber: houseNumber.toString(),
      postcode: postcode.toString(),
      ...address,
      isVendor: this.formType === "vendor",
    };
    try {
      await this.authService.register(user);
      this.locationBack();
    } catch (e) {
      this.errorMessage = (e as AxiosError).response?.data as string;
    } finally {
      this.submitting = false;
    }
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
