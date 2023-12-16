import { Component, EventEmitter, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Product } from "../../../../models";
import { PositiveNumberDirective } from "../../../directives/positive-number.directive";
import { of } from "rxjs";
import { IconsModule } from "../../../icons/icons.module";
import {
  AuthService,
  NotificationService,
  ProductService,
} from "../../../services";
import { AxiosError } from "axios";
import { buildProductFromFormValues } from "../../../../helpers";

@Component({
  selector: "pb-add-product",
  standalone: true,
  imports: [
    FormsModule,
    IconsModule,
    ReactiveFormsModule,
    PositiveNumberDirective,
  ],
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.scss",
})
export class AddProductComponent {
  submitting = false;
  errorMessage = "";
  formGroup = this.formBuilder.group({
    name: ["", Validators.required],
    description: ["", Validators.required],
    price: [
      "",
      Validators.required,
      (control: AbstractControl<number>) => {
        return Number(control.value) <= 0 ? of({ negative: true }) : of(null);
      },
    ],
    inventory: [""],
    discount: [""],
  });

  @Output() cancel = new EventEmitter();
  @Output() create = new EventEmitter<Product>();

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  onCancel() {
    this.cancel.emit();
  }

  get primaryText() {
    return "Start Selling";
  }

  async onSubmit(e?: SubmitEvent) {
    e?.preventDefault();
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }
    this.submitting = true;
    this.errorMessage = "";
    if (!this.authService.user()?.isVendor) {
      this.errorMessage = "You must be a vendor to create a product.";
      this.submitting = false;
      return;
    }
    try {
      const product = await this.productService.createProduct(
        {
          ...buildProductFromFormValues(this.formGroup, true),
        },
        this.authService.user()!.id,
      );
      this.notificationService.addNotification({
        type: "success",
        duration: 5000,
        message: `Successfully added "${product.name}"!`,
      });
      this.create.emit(product);
    } catch (e) {
      this.errorMessage = (e as AxiosError).response?.data as string;
    } finally {
      this.submitting = false;
    }
  }
}
