import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from "@angular/core";

/** Wahrscheinlich das krasseste was ich jemals gebaut habe */
@Directive({
  selector: "[positiveNumber]",
  standalone: true,
})
export class PositiveNumberDirective {
  @Input() allowDecimal: boolean = false;
  @Output() cleanedNumber = new EventEmitter<number>();
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"]) onInputChange(event: {
    target: HTMLInputElement;
  }) {
    let initialValue: string = event.target?.value;
    if (!initialValue) {
      this.el.nativeElement.value = "";
      return;
    }
    if (+initialValue < 0) {
      this.el.nativeElement.value = 0;
      return;
    }

    // If decimal values are allowed, keep the first decimal point and remove all non-numeric characters
    if (this.allowDecimal) {
      initialValue = initialValue.replace(/[^0-9\.\,]*/g, "");

      initialValue = initialValue.replace(/,/g, ".");
      const decimalPointIndex = initialValue.indexOf(".");

      if (decimalPointIndex !== -1) {
        initialValue =
          initialValue.substring(0, decimalPointIndex + 1) +
          initialValue
            .substring(decimalPointIndex + 1)
            .replace(".", "")
            .substring(0, 2);
      }
    } else {
      initialValue = initialValue.replace(/[^0-9]*/g, "");
      // If only integers are allowed, remove all non-numeric characters
    }

    if (!!initialValue) {
      this.el.nativeElement.value =
        +initialValue > 0 ||
        initialValue.endsWith(".") ||
        initialValue.endsWith(".0")
          ? initialValue.startsWith(".")
            ? "0" + initialValue
            : initialValue
          : 0;
    } else {
      this.el.nativeElement.value = "";
    }
    this.cleanedNumber.emit(Number(this.el.nativeElement.value));
  }
}
