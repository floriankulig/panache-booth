import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { IconsModule } from "../../icons/icons.module";
import { ClickOutsideDirective } from "../../directives/click-outside.directive";

@Component({
  selector: "pb-typed-dropdown",
  standalone: true,
  imports: [IconsModule, ClickOutsideDirective],
  templateUrl: "./typed-dropdown.component.html",
  styleUrl: "./typed-dropdown.component.scss",
})
export class TypedDropdownComponent<
  T extends Readonly<{ id: string; displayValue: string }>,
> implements AfterViewInit
{
  @Input() values: T[] | Readonly<T[]> = [];
  @Input() value: T["id"] = "" as T["id"];
  @Input() placeholder?: string;

  @ViewChild("input") input!: { nativeElement: HTMLInputElement };

  @Output() changedValue = new EventEmitter<T["id"]>();

  displayedValues: T[];
  dropdownOpen = false;

  constructor() {
    this.displayedValues = [...this.values];
  }

  ngAfterViewInit() {
    this.changeValue(this.values.find((v) => v.id === this.value));
  }

  private changeValue(value?: T) {
    if (!value) {
      this.input.nativeElement.value = "";
      this.canEmitChange("");
      this.filterValues("");
      return;
    }
    this.input.nativeElement.value = value.displayValue;
    this.canEmitChange(value.id);
    this.filterValues(value.displayValue);
  }

  clickOutside() {
    this.changeValue(
      this.values.find(
        (v) => v.displayValue === this.input.nativeElement.value,
      ),
    );
    this.closeDropdown();
  }

  private canEmitChange(value: T["id"]) {
    if (this.value === value) return;
    this.changedValue.emit(value);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) this.input.nativeElement.focus();
  }

  private closeDropdown() {
    this.dropdownOpen = false;
    this.input.nativeElement.blur();
  }

  onInputFocus() {
    this.dropdownOpen = true;
  }

  filterValues(event: Event | string) {
    let value = "";

    if (typeof event === "string") {
      value = event;
    } else {
      value = (event.target as HTMLInputElement).value.trim();
    }
    if (!value) {
      this.displayedValues = [...this.values];
      return;
    }
    this.displayedValues = this.values.filter(
      (v) =>
        v.displayValue.toLowerCase().includes(value.toLowerCase()) ||
        v.id.toLowerCase().includes(value.toLowerCase()),
    );
  }

  onSelectValue(value: T) {
    this.changeValue(value);
    this.closeDropdown();
  }

  onKeyPress(event: any) {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    if (
      this.displayedValues.length >= 0 &&
      !this.values.find(
        (v) => v.displayValue === this.input.nativeElement.value,
      )
    ) {
      this.changeValue(this.displayedValues[0]);
      this.closeDropdown();
    }
  }
}
