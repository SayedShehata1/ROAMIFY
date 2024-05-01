import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CountriesService } from "../../../services/countries/countries.service";
import { HotelsService } from "../../../services/hotels/hotels.service";
import { OneCountryComponent } from "../../one-country/one-country/one-country.component";
import { LoadingComponent } from "../../../components/loading/loading.component";

@Component({
  selector: "app-countries",
  standalone: true,
  imports: [HttpClientModule, OneCountryComponent, LoadingComponent],
  providers: [CountriesService, HotelsService],
  templateUrl: "./countries.component.html",
  styleUrl: "./countries.component.css",
})
export class CountriesComponent implements OnInit {
  constructor(
    private router: Router,
    private countriesService: CountriesService,
    private hotelsService: HotelsService
  ) {}
  countriesData: any;
  countries: any;
  countrydiscription: any;
  ngOnInit(): void {
    this.countriesService.getCountries().subscribe({
      next: (data) => {
        this.countriesData = data;
        this.countries = this.countriesData.data;
      },
    });
  }


  countryTrips(e: any) {
    this.router.navigate([`countries/${e.countryName}`]);

  }
}
