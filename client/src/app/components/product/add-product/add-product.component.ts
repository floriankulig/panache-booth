import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
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
export class AddProductComponent implements OnInit {
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
      name: [this.initialValues?.name || "", Validators.required],
      description: [this.initialValues?.description || "", Validators.required],
      price: [
        this.initialValues?.price || "",
        Validators.required,
        (control: AbstractControl<number>) => {
          return Number(control.value) <= 0 ? of({ negative: true }) : of(null);
        },
      ],
      category: [this.initialValues?.category || "", Validators.required],
      inventory: [
        this.initialValues ? this.initialValues.inventory || 0 : "",
        Validators.required,
      ],
      discount: [(this.initialValues?.discount || 0) * 100 || ""],
    });
    this.isVisible.set(this.initialValues?.isVisible === false ? false : true);
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
  }

  onCancel() {
    this.cancel.emit();
  }

  toggleShow() {
    this.isVisible.update((prev) => !prev);
  }

  get primaryText() {
    return this.initialValues ? "Confirm" : "Start Selling";
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
      this.errorMessage = "You must be a vendor to create/edit a product.";
      this.submitting = false;
      return;
    }
    try {
      let product: Product;
      if (this.initialValues) {
        product = (await this.updateProduct()) as Product;
      } else {
        product = await this.createProduct();
      }
      this.create.emit(product);
    } catch (e) {
      this.errorMessage = (e as AxiosError).response?.data as string;
    } finally {
      this.submitting = false;
    }
  }

  private async createProduct() {
    const product = await this.productService.createProduct(
      {
        ...buildProductFromFormValues(this.formGroup, this.isVisible()),
      },
      this.authService.user()!.id,
    );
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
