import { Component, OnInit } from '@angular/core';
import { Platform } from '../models/Platform';
import { Storage } from '@ionic/storage-angular';
import { CapacitorHttp } from '@capacitor/core';
import { XMLParser } from 'fast-xml-parser';
import { TransitUtil } from '../services/transit.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  name = 'init displayed string';
  stop = '17085';
  platform = new Platform();
  progressing = false;
  private _storage: Storage | null = null;

  constructor(private storage: Storage) { }

  async ngOnInit() {
    // Initialize storage
    const storage = await this.storage.create();
    this._storage = storage;

    const val = await this._storage.get('mystop');
    if (val) {
      console.log('get stop data from ionic storage:', val);
      this.stop = val;
    } else {
      console.log('no stop data, using default');
    }
    this.pullBusUpdate();

    setInterval(() => {
      this.pullBusUpdate();
    }, 15000);
  }

  changeStop() {
    this.pullBusUpdate();
    this._storage?.set('mystop', this.stop);
  }

  async pullBusUpdate() {
    this.progressing = true;
    const url = 'http://rtt.metroinfo.org.nz/rtt/public/utility/file.aspx?ContentType=SQLXML&Name=JPRoutePositionET2&PlatformNo=' + this.stop;

    try {
      const options = {
        url: url,
      };
      // Use CapacitorHttp to bypass CORS
      const response = await CapacitorHttp.get(options);

      const parser = new XMLParser(TransitUtil.xmlOpts);
      // response.data generally contains the body string for XML responses
      const eta = parser.parse(response.data);
      console.log('parsed eta:', eta);

      if (eta && eta.JPRoutePositionET2 && eta.JPRoutePositionET2.Platform) {
        this.platform = TransitUtil.parsePlatform(eta.JPRoutePositionET2.Platform);
      } else {
        // Handle case where platform is not found or error
        console.warn('Platform not found in XML response');
        this.platform = new Platform();
        this.platform.name = "Stop Not Found";
        this.platform.routes = [];
      }
    } catch (err) {
      console.error('Error fetching bus data', err);
    }
    this.progressing = false;
  }
}
