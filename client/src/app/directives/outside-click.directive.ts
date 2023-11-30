import { Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";

@Directive({
  selector: "[outsideClick]",
})
export class OutsideClickDirective implements OnInit, OnDestroy {
  @Input("outsideClick") handler: Function = () => {};

  private listener: EventListener;

  constructor(private elementRef: ElementRef) {
    this.listener = (event: Event) => {
      if (
        !this.elementRef.nativeElement.contains(event.target as HTMLElement)
      ) {
        this.handler(event);
      }
    };
  }

  ngOnInit(): void {
    document.addEventListener("click", this.listener, true);
    document.addEventListener("touchstart", this.listener, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener("click", this.listener);
    document.removeEventListener("touchstart", this.listener);
  }
}
