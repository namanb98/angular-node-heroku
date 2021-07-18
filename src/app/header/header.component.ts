import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy
{
  userAuthenticated = false;
  private authLisetnerSubs: Subscription;
  constructor(private authservice: AuthService) {}

  ngOnInit(){
    this.userAuthenticated = this.authservice.getIsAuth();
    this.authLisetnerSubs = this.authservice
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
  }

  onLogout(){
    this.authservice.logout();
  }

  ngOnDestroy(){
    this.authLisetnerSubs.unsubscribe();
  }
}

