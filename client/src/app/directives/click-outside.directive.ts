import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from "@angular/core";

@Directive({
  selector: "[pbClickOutside]",
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() pbClickOutside = new EventEmitter<void>();
  constructor(private el: ElementRef) {}

  @HostListener("document:click", ["$event"]) onClick(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.pbClickOutside.emit();
    }
  }
}
