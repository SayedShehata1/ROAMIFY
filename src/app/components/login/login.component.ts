declare var google: any;
import { Component, NgZone, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { HeaderComponent } from "../home/header/header.component";
import { UserService } from "../../services/user/user.service";
import { HttpClientModule } from "@angular/common/http";
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    HttpClientModule,
    RouterModule,
    MessagesModule
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
errorLogin!:boolean;
errorMessages!:Message[];

  constructor(private user: UserService , private zone:NgZone) {}
  private router = inject(Router);
  isLoading: boolean = false;
  //google intialize
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id:
        "74021032483-lm9ummnk7o7kovemrlkd826ul63u83hd.apps.googleusercontent.com",
      callback: (resp: any) => this.handleLogin(resp),
    });
    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      // theme: 'filled_blue',
      size: "large",
      shape: "rectangle",
      text: "continue with google",
      width: 300,
    });
    this.errorMessages = [
      { severity: 'error', summary: 'Error :', detail: 'Invalid email or password' },
  ];
  }

  // decode token
  private decodeToken(token: string) {
    return JSON.parse(atob(token.split(".")[1]));
  }

  // handling google login
  handleLogin(respone: any) {
    if (respone) {
      //deconde the token
      const payload = this.decodeToken(respone.credential);
      //store in session
      // sessionStorage.setItem("loggedInUser", JSON.stringify(payload));
      localStorage.setItem("user", JSON.stringify(payload));
      const loginData = {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        image: payload.picture,
      };
      this.isLoading = true;
      this.user.loginWithGoogle(loginData).subscribe({
        next: (data: any) => {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("provider", "google");
          data.data.FavoriteTrips = data.data.FavoriteTrips.map((fav: any) => {
            fav.isFavourite = true;
            return fav;
          });
          localStorage.setItem(
            "favouriteTrips",
            JSON.stringify(data.data.FavoriteTrips)
          );
          localStorage.setItem(
            "bookedTrips",
            JSON.stringify(data.data.bookedTrips)
          );
          this.fireLoggedIn();

          const previousUrl = this.user.getPreviousUrl() || "/";
          this.zone.run(()=>{       
            this.router.navigate([previousUrl]);
            this.user.clearPreviousUrl();
            this.isLoading = false;
          })

        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
      });
    }
  }

  LoginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    pass: new FormControl("", [
      Validators.required,
      Validators.pattern(/^\w{4,}$/),
    ]),
  });

  get emailValid() {
    return this.LoginForm.controls["email"];
  }
  get passValid() {
    return this.LoginForm.controls["pass"];
  }

  getData() {
    if (this.LoginForm.valid) {
      this.isLoading = true;
      this.user
        .login({
          email: this.LoginForm.controls["email"].value || "",
          password: this.LoginForm.controls["pass"].value || "",
        })
        .subscribe({
          next: (data: any) => {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));
            data.data.FavoriteTrips = data.data.FavoriteTrips.map(
              (fav: any) => {
                fav.isFavourite = true;
                return fav;
              }
            );
            localStorage.setItem(
              "favouriteTrips",
              JSON.stringify(data.data.FavoriteTrips)
            );
            localStorage.setItem(
              "bookedTrips",
              JSON.stringify(data.data.bookedTrips)
            );
            this.fireLoggedIn();
            const previousUrl = this.user.getPreviousUrl() || "/";

              this.router.navigate([previousUrl]);
              this.user.clearPreviousUrl();
              this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.errorLogin = true;
          },
        });
    }
  }

  fireLoggedIn() {
    localStorage.setItem("isLoggedIn", "true");
  }
}
