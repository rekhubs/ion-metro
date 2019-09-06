import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'fast-xml-parser';
import { parse } from 'fast-xml-parser';
import anime from 'animejs/lib/anime.es.js';

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
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    let url = 'https://reqres.in/api/users';
    this.http.get<any>(url).subscribe(resp => {
      console.log('got data!', resp);
      this.name = resp.data[0].email;
    }, e => {
      console.log('error getting data!', e);
    });

    anime({
      targets: 'path',
      strokeDashoffset: function(el) {
        var pathLength = el.getTotalLength();
        el.setAttribute('stroke-dasharray', pathLength);
        return [-pathLength, 0];
      },
      stroke: {
        value: function(el, i) {
          return 'rgb(200,'+ i * 8 +',150)'; 
        },
        easing: 'linear',
        duration: 2000,
      },
      strokeWidth: {
        value: 6,
        easing: 'linear',
        delay: function(el, i) { 
          return 1200 + (i * 40); 
        },
        duration: 800,
      },
      delay: function(el, i) { 
        return i * 60; 
      },
      duration: 1200,
      easing: 'easeOutExpo',
      loop: true,
      direction: 'alternate'
    });




    const xml = `<JPRoutePositionET2 xmlns="urn:connexionz-co-nz:jp" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:connexionz-co-nz:jp JourneyPlanner.xsd">
    <Content Expires="2019-08-10T18:39:01+12:00" MaxArrivalScope="60"/>
    <Platform PlatformTag="1500" Name="Riccarton Rd near Wainui St">
    <Route RouteNo="80" Name="Lincoln/Parklands">
    <Destination Name="Parklands via City">
    <Trip ETA="45" TripID="1974" WheelchairAccess="true"/>
    </Destination>
    </Route>
    <Route RouteNo="100" Name="Wigram/The Palms">
    <Destination Name="The Palms">
    <Trip ETA="1" TripID="4495" WheelchairAccess="true"/>
    <Trip ETA="29" TripID="4523" WheelchairAccess="true"/>
    <Trip ETA="56" TripID="4482" WheelchairAccess="true"/>
    </Destination>
    </Route>
    <Route RouteNo="120" Name="Burnside/Spreydon">
    <Destination Name="Spreydon & Barrington">
    <Trip ETA="8" TripID="4454"/>
    </Destination>
    </Route>
    <Route RouteNo="130" Name="Hei Hei/Avonhead">
    <Destination Name="Avonhead">
    <Trip ETA="2" TripID="92" WheelchairAccess="true"/>
    <Trip ETA="31" TripID="1835" WheelchairAccess="true"/>
    <Trip ETA="58" TripID="52" WheelchairAccess="true"/>
    </Destination>
    </Route>
    <Route RouteNo="Oa" Name="Orbiter">
    <Destination Name="Orbiter via Barrington">
    <Trip ETA="6" TripID="2437" WheelchairAccess="true"/>
    <Trip ETA="21" TripID="2479" WheelchairAccess="true"/>
    <Trip ETA="35" TripID="2512" WheelchairAccess="true"/>
    <Trip ETA="49" TripID="2523" WheelchairAccess="true"/>
    </Destination>
    </Route>
    <Route RouteNo="P" Name="Purple Line">
    <Destination Name="Sumner via City">
    <Trip ETA="19" TripID="2964" WheelchairAccess="true"/>
    <Trip ETA="47" TripID="2946" WheelchairAccess="true"/>
    </Destination>
    </Route>
    <Route RouteNo="Y" Name="Yellow Line">
    <Destination Name="New Brighton via City">
    <Trip ETA="2" TripID="1263" WheelchairAccess="true"/>
    <Trip ETA="13" TripID="1816" WheelchairAccess="true"/>
    <Trip ETA="36" TripID="1876" WheelchairAccess="true"/>
    </Destination>
    </Route>
    <Alert ValidFrom="2017-12-19" ValidTo="2019-12-25" Title="Notification">
    <Detail>
    Express trip rules - Buses travelling to the city do not pick up after Denton Park, Hornby (drop offs only). Buses travelling to Rolleston do not drop off before the Hub Hornby (pick ups only).
    </Detail>
    <Route RouteNo="Y"/>
    </Alert>
    </Platform>
    </JPRoutePositionET2>`;

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
    let eta = parse(xml, xmlOpts);
    console.log('\n\n\n\neta xml parsed:', eta);



    const myStop = '10003';
    const golfCourseStop = '17085';
    const exChangeB = '53116';

    // --------- get xml and parse
    url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + golfCourseStop;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + exChangeB;

    // url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + myStop;

    const httpOpts: Object = {responseType: 'text'};
    this.http.get(url, httpOpts).subscribe(resp => {
      console.log('got eta raw return!', resp);

      eta = parse(stringify(resp), xmlOpts);
      console.log('\n\n\n\nonline eta xml parsed:', eta);


      const overalParsedObj = TransitUtil.parsePlatform(eta.JPRoutePositionET2.Platform);
      console.log('\n\n\neta parsed to json:', overalParsedObj);
      this.platform = overalParsedObj;

    }, e => {
      console.log('error getting eta!', e);
    });




  }


  

}
