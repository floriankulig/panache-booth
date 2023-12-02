import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[positiveNumber]",
  standalone: true,
})
export class PositiveNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"]) onInputChange(event: InputEvent) {
    const initalValue = this.el.nativeElement.value;

    this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, "");
    // if (this.el.nativeElement.value != "") {
    //   this.el.nativeElement.value = Math.abs(
    //     parseInt(this.el.nativeElement.value),
    //   );
    // }
  }
}
