import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import 'fast-xml-parser';
import { parse } from 'fast-xml-parser';


import { stringify } from '@angular/compiler/src/util';
import { Trip } from '../models/Trip';
import { Route } from '../models/Route';
import { Platform } from '../models/Platform';
import { TransitUtil } from '../services/transit.util';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  name = 'init displayed string';
  platform = new Platform();

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  ngOnInit(): void {

    // testing ionic storage
    this.storage.set('mystop1', 17085);
    this.storage.get('mystop1').then(val => {
      console.log('get stop data from ionic storage:', val);
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










    this.pullBusUpdate();
    setInterval(() => {
      this.pullBusUpdate();
    }, 15000);






  }

  pullBusUpdate() {

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
    // let eta = parse(xml, xmlOpts);
    // console.log('\n\n\n\neta xml parsed:', eta);



    const myStop = '10003';
    const golfCourseStop = '17085';
    const exChangeB = '53116';

    // --------- get xml and parse
    const url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + golfCourseStop;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + exChangeB;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + myStop;

    const httpOpts: Object = { responseType: 'text' };

    console.log('now pulling bus data...');
    this.http.get(url, httpOpts).subscribe(resp => {
      console.log('got eta raw return!', resp);

      const eta = parse(stringify(resp), xmlOpts);
      console.log('\n\n\n\nonline eta xml parsed:', eta);


      const overalParsedObj = TransitUtil.parsePlatform(eta.JPRoutePositionET2.Platform);
      console.log('\n\n\neta parsed to json:', overalParsedObj);
      this.platform = overalParsedObj;

    }, e => {
      console.log('error getting eta!', e);
    });

  }




}
