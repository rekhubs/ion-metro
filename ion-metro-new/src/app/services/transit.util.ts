import { Trip } from '../models/Trip';
import { Route } from '../models/Route';
import { Platform } from '../models/Platform';

export class TransitUtil {

    public static readonly xmlOpts = {
        attributeNamePrefix: '@_',
        attributesGroupName: 'attr',
        textNodeName: '#text',
        ignoreAttributes: false,
        removeNSPrefix: false,
        allowBooleanAttributes: false,
        parseTagValue: true,
        parseAttributeValue: false,
        trimValues: true,
        cdataTagName: '__cdata',
        cdataPositionChar: '\\c',
        // localeRange: '', // v5 might handle this differently, omitting if unsure or keeping
        parseTrueNumberOnly: false,
        attributeValueProcessor: (name: any, val: any, jPath: any) => val.replace(/&amp;/g, '&'),
        tagValueProcessor: (name: any, val: any, jPath: any) => val.replace(/&amp;/g, '&')
    };

    static parseTrip(obj: any): Trip {
        const trip = new Trip();
        const attr = obj.attr;
        trip.eta = attr['@_ETA'];
        trip.id = attr['@_TripID'];
        trip.wheelchairAccess = attr['@_WheelchairAccess'];
        return trip;
    }

    static parseRouteWithDest(obj: any, refRoute: Route): Route {
        const route = Object.assign(new Route(), refRoute);
        route.destination = obj.attr['@_Name'];
        route.trips = [];

        if (!Array.isArray(obj.Trip)) {
            route.trips.push(this.parseTrip(obj.Trip));
        } else {
            obj.Trip.forEach((tr: any) => {
                route.trips.push(this.parseTrip(tr));
            });
        }
        return route;
    }

    static parseRoute(obj: any): Route[] {
        const routes = [];
        const route = new Route();
        route.number = obj.attr['@_RouteNo'];
        route.name = obj.attr['@_Name'];

        const destTag = obj.Destination;
        if (!Array.isArray(destTag)) {
            routes.push(this.parseRouteWithDest(destTag, route));
        } else {
            destTag.forEach((r: any) => {
                routes.push(this.parseRouteWithDest(r, route));
            });
        }
        return routes;
    }

    static parsePlatform(obj: any): Platform {
        const platform = new Platform();
        platform.name = obj.attr['@_Name'];
        platform.tag = obj.attr['@_PlatformTag'];
        platform.routes = [];

        let rawRoutes: any[] = [];
        if (!Array.isArray(obj.Route)) {
            rawRoutes.push(obj.Route);
        } else {
            rawRoutes = obj.Route;
        }
        rawRoutes.forEach((routes: any) => {
            this.parseRoute(routes).forEach(route => {
                platform.routes.push(route);
            });
        });
        return platform;
    }
}
