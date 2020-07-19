import { Component, OnInit } from '@angular/core';
import { Platform } from 'src/app/models/Platform';
// import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { parse } from 'fast-xml-parser';
import { stringify } from '@angular/compiler/src/util';
import { TransitUtil } from 'src/app/services/transit.util';




// import 'fast-xml-parser';


import { Trip } from '../../models/Trip';
import { Route } from '../../models/Route';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  name = 'init displayed string';
  stop = '17085';
  platform = new Platform();
  progressing = false;

  constructor(
    private http: HTTP,
    private storage: Storage
  ) { }

  ngOnInit(): void {

    // testing ionic storage
    // this.storage.set('mystop', 17085);
    this.storage.get('mystop').then(val => {
      console.log('get stop data from ionic storage:', val);
      this.stop = val;
      this.pullBusUpdate();
    }, e => {
      console.error('cannot get data from storage! using default one', e);
    });









    setInterval(() => {
      this.pullBusUpdate();
    }, 15000);






  }

  changeStop() {
    console.log('say something, hahaahahha!');
    console.log('what is this.stop now:', this.stop);
    this.pullBusUpdate();
    this.storage.set('mystop', this.stop).then(_ => {});
  }

  async pullBusUpdate() {
    this.progressing = true;

    const myStop = '10003';
    const golfCourseStop = '17085';
    const exChangeB = '53116';

    // --------- get xml and parse
    let url = 'http://rtt.metroinfo.org.nz/rtt/public/utility' +
    '/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + this.stop;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + exChangeB;
    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + myStop;


    const params = {};
    const headers = {};
    try {

      this.http.setServerTrustMode('nocheck').then(res => {
        // this.http.setSSLCertMode('nocheck').then(res => {
        console.log('cordova http: set ssl no check, suc');
      }, e => {
        console.error('cordova http: failed to set ssl no check');
      });
      const response = await this.http.get(url, params, headers);

      const eta = parse(stringify(response.data), TransitUtil.xmlOpts);
      console.log('\n\n\n\nonline eta xml parsed:', eta);

      this.platform = TransitUtil.parsePlatform(eta.JPRoutePositionET2.Platform);
      console.log('\n\n\neta parsed to json:', this.platform);
    } catch (err) {
      console.error(err);
    }
    this.progressing = false;

  }

}
