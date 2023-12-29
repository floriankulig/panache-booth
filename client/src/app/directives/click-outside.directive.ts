import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from "@angular/core";

@Directive({
  selector: "[onClickOutside]",
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() onClickOutside = new EventEmitter<MouseEvent>();
  constructor(private el: ElementRef) {}

  @HostListener("document:click", ["$event"]) onClick(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.onClickOutside.emit(event);
    }
  }
}
