import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewEncapsulation, inject } from "@angular/core";
import {
  FormControl,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { RatingModule } from "primeng/rating";
import { CardComponent } from "../card/card.component";
import { render } from "creditcardpayments/creditCardPayments";
import { TripsService } from "../../services/trips/trips.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-pay",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    RatingModule,
    CardComponent,
    RouterModule
  ],
  templateUrl: "./pay.component.html",
  styleUrl: "./pay.component.css",
  providers: [TripsService],
  encapsulation: ViewEncapsulation.None,
})
export class PayComponent implements OnInit {
  trip: any;
  isTrip: boolean = true;
  id: any;
  private router = inject(Router);
  constructor(private trips: TripsService, private route: ActivatedRoute) {
    render({
      id: "#myPaymentButtons",
      currency: "USD",
      value: "100.00",
      onApprove: (details: any) => {
        this.route.params.subscribe((params) => {
          this.id = params["id"];
        });
        this.trips.bookTrip(this.id).subscribe({
          next: (data: any) => {
            this.router.navigate(["/home"]);
          },
          error: (err) => {
            console.log(err);
          },
        });
        alert("Transaction successfull");
      },
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
    this.trips.getTripById(this.id).subscribe({
      next: (data: any) => {
        this.trip = data.data.trip;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // card component
  value: number = 3;

  isHovered: boolean = false;
  isClicked: boolean = false;

  addedToFav() {
  }

  toggleFavourite() {
    this.isClicked = !this.isClicked;
    // Call addedToFav() method if you want to execute the function on click
    this.addedToFav();
  }

  // form component
  myRegForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    cNumber: new FormControl(null, [
      Validators.required,
      Validators.maxLength(14),
      Validators.minLength(14),
    ]),
    ccExp: new FormControl(null, [
      Validators.required,
      Validators.maxLength(5),
      Validators.minLength(5),
    ]),
    ccv: new FormControl(null, [
      Validators.required,
      Validators.maxLength(3),
      Validators.minLength(3),
    ]),
  });

  get emailValid() {
    return this.myRegForm.controls["email"];
  }
  get cNumberValid() {
    return this.myRegForm.controls["cNumber"];
  }
  get ccExpValid() {
    return this.myRegForm.controls["ccExp"];
  }
  get ccvValid() {
    return this.myRegForm.controls["ccv"];
  }

  getData() {
    if (this.myRegForm.valid) {
      //push
    }
  }
}
