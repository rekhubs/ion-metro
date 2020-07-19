import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit  {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Schedule',
      url: '/folder/home',
      icon: 'bus'
    },
    {
      title: 'Schedule Web',
      url: '/folder/home-web',
      icon: 'bus'
    },
    {
      title: 'Info',
      url: '/folder/info',
      icon: 'information-circle'
    },
    {
      title: 'Favorites',
      url: '/folder/favorites',
      icon: 'heart'
    },
    {
      title: 'Settings',
      url: '/folder/settings',
      icon: 'hammer'
    }
  ];
  public labels = ['Home', 'Work', 'Shop', 'Dine'];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.styleLightContent();
      }
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
