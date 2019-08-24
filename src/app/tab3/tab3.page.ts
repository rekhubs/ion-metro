import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { parse } from 'fast-xml-parser';
import { Platform } from '../models/Platform';
import { stringify } from '@angular/compiler/src/util';
import { TransitUtil } from '../services/transit.util';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  name = 'uninitialized..';
  platform = new Platform();

  constructor(private http: HTTP) { }

  ngOnInit() {
    this.getData();
    this.getBusInfo();
  }

  async getData() {
    try {
      let url = 'https://reqres.in/api/users';
      const params = {};
      const headers = {};

      const response = await this.http.get(url, params, headers);

      console.log(response.status);
      console.log(JSON.parse(response.data)); // JSON data returned by server
      const parsedData = JSON.parse(response.data);
      this.name = parsedData.data[0].email;
      console.log(response.headers);

    } catch (error) {
      console.log(error);
      // console.error(error.status);
      // console.error(error.error); // Error message as string
      // console.error(error.headers);
    }
  }



  async getBusInfo() {
    const xmlOpts = {
      attributeNamePrefix: '@_',
      attrNodeName: 'attr', // default is 'false'
      textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: false,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: false,
      trimValues: true,
      cdataTagName: '__cdata', // default is 'false'
      cdataPositionChar: '\\c',
      localeRange: '', // To support non english character in tag/attribute values.
      parseTrueNumberOnly: false,
      // attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
      // tagValueProcessor : a => he.decode(a) //default is a=>a
    };
    



    let url = '';
    const myStop = '10003';
    const golfCourseStop = '17085';
    const exChangeB = '53116';

    // --------- get xml and parse
    url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + golfCourseStop;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + exChangeB;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + myStop;

    
    const params = {};
    const headers = {};
    try {
      this.http.setSSLCertMode('nocheck').then(res => {
        console.log('cordova http: set ssl no check, suc');
      }, e => {
        console.error('cordova http: failed to set ssl no check');
      });
      const response = await this.http.get(url, params, headers);

      const eta = parse(stringify(response.data), xmlOpts);
      console.log('\n\n\n\nonline eta xml parsed:', eta);

      this.platform = TransitUtil.parsePlatform(eta.JPRoutePositionET2.Platform);
      console.log('\n\n\neta parsed to json:', this.platform);
    } catch (err) {
      console.error(err);
    }
    
  }



}
