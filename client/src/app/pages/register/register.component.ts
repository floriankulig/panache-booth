import { Location } from "@angular/common";
import { AxiosError } from "axios";
import { Component, effect } from "@angular/core";
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
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterModule,
} from "@angular/router";
import { AuthService } from "../../services";
import { buildUserFromFormValues } from "../../../helpers";
import { User } from "../../../models";

@Component({
  selector: "pb-register",
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
  formType: "vendor" | "customer" = "customer";
  isUserUpdate = false;
  submitting = false;
  errorMessage = "";
  formStep = 1;

  steps: FormGroup[];
  formGroup: FormGroup;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.activatedRoute.url.subscribe((url) => {
      this.isUserUpdate = url[0]?.path === "update-profile";
    });

    const initialState = this.isUserUpdate
      ? this.authService.user()
      : undefined;

    if (initialState) {
      this.isUserUpdate = true;
      this.formType = initialState?.isVendor ? "vendor" : "customer";
      this.formStep = 2;
    }

    this.steps = [
      this.formBuilder.group(
        {
          username: [initialState?.userName || "", Validators.required],
          email: [
            initialState?.email || "",
            [Validators.required, Validators.email],
          ],
          password: ["", this.isUserUpdate ? undefined : Validators.required],
          confirmPassword: [
            "",
            this.isUserUpdate ? undefined : Validators.required,
          ],
        },
        {
          validator: this.customValidators,
        } as AbstractControlOptions,
      ),
      this.formBuilder.group({
        street: [initialState?.street || "", Validators.required],
        houseNumber: [initialState?.houseNumber || "", Validators.required],
        postcode: [initialState?.postcode || "", Validators.required],
        city: [initialState?.city || "", Validators.required],
      }),
      this.formBuilder.group({
        iban: [initialState?.iban || "", Validators.required],
        bic: [initialState?.bic || "", Validators.required],
        shippingCost: [initialState?.shippingCost || 0],
        shippingFreeFrom: [
          initialState?.shippingFreeFrom && initialState?.shippingFreeFrom >= 0
            ? initialState?.shippingFreeFrom
            : "",
        ],
      }),
    ];

    this.formGroup = this.steps[this.formStep - 1];
  }

  get primaryText() {
    return this.formStep < this.maxSteps
      ? "Next Step"
      : this.submitting
      ? "loading..."
      : this.isUserUpdate
      ? "Update"
      : "Sign Up";
  }

  back() {
    if (this.formStep > this.minStep) {
      this.formStep--;
      this.errorMessage = "";
      this.formGroup = this.steps[this.formStep - 1];
    } else {
      this.locationBack();
    }
  }

  locationBack() {
    if (this.activatedRoute.snapshot.queryParams["redirect"]) {
      this.router.navigate([
        this.router.parseUrl(
          this.activatedRoute.snapshot.queryParams["redirect"],
        ),
      ]);
    } else {
      if (this.router.navigated) {
        this.location.back();
      } else {
        // If the last visited page is not within the app, redirect to "/"
        this.router.navigate(["/"]);
      }
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
    if (this.formStep < this.maxSteps) {
      this.formStep++;
      this.formGroup = this.steps[this.formStep - 1];
    } else {
      this.submit();
    }
  }

  toggleFormType() {
    this.formType = this.formType === "vendor" ? "customer" : "vendor";
    if (this.formStep === 3) {
      this.formStep = 2;
      this.formGroup = this.steps[this.formStep - 1];
    }
  }

  get maxSteps() {
    return this.formType === "vendor" ? 3 : 2;
  }

  get minStep() {
    return this.isUserUpdate ? 2 : 1;
  }

  private async submit() {
    this.submitting = true;
    const { password, ...user } = buildUserFromFormValues(
      this.steps,
      this.formType,
    );
    try {
      if (this.isUserUpdate) {
        await this.authService.updateUser(
          {
            ...user,
          },
          this.authService.user()!.id,
        );
      } else {
        await this.authService.register({ password, ...user });
      }
      this.locationBack();
    } catch (e) {
      this.errorMessage = (e as AxiosError).response?.data as string;
    } finally {
      this.submitting = false;
    }
  }

  private customValidators(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;
    if (password !== confirmPassword) {
      formGroup.get("confirmPassword")?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get("confirmPassword")?.setErrors(null);
    }
  }
}
