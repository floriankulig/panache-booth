import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CATEGORIES, Category, CategoryID, Product } from "../../../../models";
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
import { SwitchComponent } from "../../switch/switch.component";
import { TypedDropdownComponent } from "../../typed-dropdown/typed-dropdown.component";

@Component({
  selector: "pb-add-product",
  standalone: true,
  imports: [
    FormsModule,
    IconsModule,
    ReactiveFormsModule,
    PositiveNumberDirective,
    TypedDropdownComponent,
    SwitchComponent,
  ],
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.scss",
})
export class AddProductComponent {
  @Input() initialValues?: Product;
  submitting = false;
  errorMessage = "";
  formGroup: FormGroup = new FormGroup({});
  isVisible = signal(true);

  @Output() cancel = new EventEmitter();
  @Output() create = new EventEmitter<Product>();

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.initValues();
  }

  ngOnInit() {
    this.initValues();
  }

  private initValues() {
    this.formGroup = this.formBuilder.group({
      name: [this.initialValues?.name || "test", Validators.required],
      description: [
        this.initialValues?.description || "test",
        Validators.required,
      ],
      price: [
        this.initialValues?.price || "23",
        Validators.required,
        (control: AbstractControl<number>) => {
          return Number(control.value) <= 0 ? of({ negative: true }) : of(null);
        },
      ],
      category: [this.initialValues?.category || "", Validators.required],
      inventory: [this.initialValues?.inventory || ""],
      discount: [(this.initialValues?.discount || 0) * 100 || ""],
    });
    this.isVisible = signal(this.initialValues?.isVisible || true);
  }

  get categoryValue(): CategoryID {
    return this.formGroup.get("category")?.value;
  }
  get categoryValues(): Readonly<Category[]> {
    return CATEGORIES;
  }

  onCategoryChange(category: CategoryID) {
    this.formGroup.patchValue({ category });
    this.formGroup.get("category")?.markAsTouched();
    console.log("category change", category);
  }

  onCancel() {
    this.cancel.emit();
  }

  toggleShow() {
    this.isVisible.update((prev) => !prev);
  }

  get primaryText() {
    return !!this.initialValues ? "Confirm" : "Start Selling";
  }

  async onSubmit(e?: SubmitEvent) {
    e?.preventDefault();
    this.formGroup.markAllAsTouched();
    console.log(this.formGroup);
    console.log(this.formGroup.status);
    console.log(this.formGroup.valid);
    console.log(this.formGroup.invalid);
    if (!this.formGroup.valid) {
      return;
    }
    this.submitting = true;
    this.errorMessage = "";
    console.log("test");
    if (!this.authService.user()?.isVendor) {
      this.errorMessage = "You must be a vendor to create/edit a product.";
      this.submitting = false;
      return;
    }
    console.log("test2");
    try {
      let product: Product;
      if (!!this.initialValues) {
        console.log("update 1");
        product = (await this.updateProduct()) as Product;
        console.log("update 2");
      } else {
        console.log("create 1");
        product = await this.createProduct();
        console.log("create 2");
      }
      console.log("made request");
      this.create.emit(product);
    } catch (e) {
      this.errorMessage = (e as AxiosError).response?.data as string;
    } finally {
      this.submitting = false;
    }
  }

  private async createProduct() {
    console.log("create product");
    const product = await this.productService.createProduct(
      {
        ...buildProductFromFormValues(this.formGroup, this.isVisible()),
      },
      this.authService.user()!.id,
    );
    console.log("created product");
    this.notificationService.addNotification({
      type: "success",
      duration: 5000,
      message: `Successfully added "${product.name}"!`,
    });
    return product;
  }
  private async updateProduct() {
    if (!this.initialValues) {
      return;
    }
    const product = await this.productService.updateProduct({
      ...this.initialValues,
      ...buildProductFromFormValues(this.formGroup, this.isVisible()),
    });
    this.notificationService.addNotification({
      type: "success",
      duration: 5000,
      message: `Successfully updated "${product.name}"!`,
    });
    return product;
  }
}
