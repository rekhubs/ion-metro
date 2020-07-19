import { Component, OnInit } from '@angular/core';
import { Platform } from 'src/app/models/Platform';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { parse } from 'fast-xml-parser';
import { stringify } from '@angular/compiler/src/util';
import { TransitUtil } from 'src/app/services/transit.util';




// import 'fast-xml-parser';


import { Trip } from '../../models/Trip';
import { Route } from '../../models/Route';

@Component({
  selector: 'app-home-web',
  templateUrl: './home-web.component.html',
  styleUrls: ['./home-web.component.scss'],
})
export class HomeWebComponent implements OnInit {

  name = 'init displayed string';
  platform = new Platform();
  stop = 17085;

  progressing = false;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  ngOnInit(): void {

    // testing ionic storage
    // this.storage.set('mystop1', 17085);
    this.storage.get('mystop1').then(val => {
      console.log('get stop data from ionic storage:', val);
      this.stop = val;
      this.pullBusUpdate();
    }, e => {
      console.error('cannot get data from storage!', e);
    });



    const url = 'https://reqres.in/api/users';
    this.http.get<any>(url).subscribe(resp => {
      console.log('got data!', resp);
      this.name = resp.data[0].email;
    }, e => {
      console.log('error getting data!', e);
    });










    // this.pullBusUpdate();
    setInterval(() => {
      this.pullBusUpdate();
    }, 15000 * 1000);
  }



  changeStop() {
    console.log('say something, hahaahahha!');
    console.log('what is this.stop now:', this.stop);
    this.pullBusUpdate();
    this.storage.set('mystop1', this.stop).then(_ => {});
  }


  pullBusUpdate() {

    this.progressing = true;

    const myStop = '10003';
    const golfCourseStop = '17085';
    const exChangeB = '53116';

    // --------- get xml and parse
    let url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/' +
    'file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + this.stop;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + exChangeB;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + myStop;

    const httpOpts: Object = { responseType: 'text' };

    console.log('now pulling bus data...');
    this.http.get(url, httpOpts).subscribe(resp => {
      console.log('got eta raw return!', resp);

      const eta = parse(stringify(resp), TransitUtil.xmlOpts);
      console.log('\n\n\n\nonline eta xml parsed:', eta);


      const overalParsedObj = TransitUtil.parsePlatform(eta.JPRoutePositionET2.Platform);
      console.log('\n\n\neta parsed to json:', overalParsedObj);
      this.platform = overalParsedObj;

      this.progressing = false;
    }, e => {
      console.log('error getting eta!', e);
      this.progressing = false;
    });

  }

}

