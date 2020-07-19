import { Trip } from '../models/Trip';
import { Route } from '../models/Route';
import { Platform } from '../models/Platform';

export class TransitUtil {

    public static readonly xmlOpts = {
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
        attrValueProcessor: a => a.replace(/&amp;/g, '&'), // default is a=>a
        tagValueProcessor: a => a.replace(/&amp;/g, '&') // default is a=>a
    };

    static parseTrip(obj): Trip {
        const trip = new Trip();
        const attr = obj.attr;
        trip.eta = attr['@_ETA'];
        trip.id = attr['@_TripID'];
        trip.wheelchairAccess = attr['@_WheelchairAccess'];
        return trip;
    }

    static parseRouteWithDest(obj, refRoute: Route): Route {
        const route = Object.assign(new Route(), refRoute);
        route.destination = obj.attr['@_Name'];
        route.trips = [];

        if (!Array.isArray(obj.Trip)) {
            route.trips.push(this.parseTrip(obj.Trip));
        } else {
            obj.Trip.forEach(tr => {
                route.trips.push(this.parseTrip(tr));
            });
        }
        return route;
    }

    static parseRoute(obj): Route[] {
        const routes = [];
        const route = new Route();
        route.number = obj.attr['@_RouteNo'];
        route.name = obj.attr['@_Name'];

        const destTag = obj.Destination;
        if (!Array.isArray(destTag)) {
            routes.push(this.parseRouteWithDest(destTag, route));
        } else {
            destTag.forEach(r => {
                routes.push(this.parseRouteWithDest(r, route));
            });
        }
        return routes;
    }

    static parsePlatform(obj): Platform {
        const platform = new Platform();
        platform.name = obj.attr['@_Name'];
        platform.tag = obj.attr['@_PlatformTag'];
        platform.routes = [];

        let rawRoutes = [];
        if (!Array.isArray(obj.Route)) {
            rawRoutes.push(obj.Route);
        } else {
            rawRoutes = obj.Route;
        }
        rawRoutes.forEach(routes => {
            this.parseRoute(routes).forEach(route => {
                platform.routes.push(route);
            });
        });
        return platform;
    }
}
