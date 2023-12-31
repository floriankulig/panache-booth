import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "pb-auth-layout",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.scss",
})
export class AuthComponent {}
