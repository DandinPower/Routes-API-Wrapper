import {
  LatLng,
  ResponseBodyUbike,
  Step,
  SingleRouteOfResponseBody,
  TravelMode,
  RouteType
} from '../interface';
import { GetRoutesUbike } from '.';
import { parseRawDuration, parseMode } from './utils';

export async function parseResponse() {
  const originLatLng: LatLng = {
    latitude: 25.048611088953038,
    longitude: 121.51685493128674
  };
  const destinationLatLng: LatLng = {
    latitude: 25.042611925171517,
    longitude: 121.56383226466977
  };

  let response: ResponseBodyUbike = await GetRoutesUbike(
    originLatLng,
    destinationLatLng
  );

  let handler: RoutesHandler = new RoutesHandler(response);
  handler.showRoutes();
}

class Route {
  private steps: Array<Step>;
  private distanceMeters: number;
  private duration: number;

  constructor(singleRouteResponse: SingleRouteOfResponseBody) {
    this.distanceMeters = singleRouteResponse.distanceMeters;
    this.duration = parseRawDuration(singleRouteResponse.duration);
    this.steps = [];
    this.addStepsFromSingleRouteResponse(singleRouteResponse);
  }

  private addStepsFromSingleRouteResponse(
    singleRouteResponse: SingleRouteOfResponseBody
  ) {
    singleRouteResponse.legs[0].steps.forEach((step) => {
      let mode: TravelMode = parseMode(step);
      let distanceMeters: number = step.distanceMeters;
      let durationSeconds: number = parseRawDuration(step.staticDuration);
      let startLatLng: LatLng = step.startLocation.latLng;
      let endLatLng: LatLng = step.endLocation.latLng;
      this.steps.push({
        mode,
        distanceMeters,
        durationSeconds,
        startLatLng,
        endLatLng
      });
    });
  }

  public getJsonString(): string {
    let routeType: RouteType = {
      steps: this.steps,
      distanceMeters: this.distanceMeters,
      duration: this.duration
    };
    return JSON.stringify(routeType, null, 2);
  }
}

class RoutesHandler {
  private routes: Array<Route>;

  constructor(response: ResponseBodyUbike) {
    this.routes = [];
    this.createRoutesObjectFromResponse(response);
  }

  public addNewRoute(singleRouteResponse: SingleRouteOfResponseBody): void {
    this.routes.push(new Route(singleRouteResponse));
  }

  public showRoutes(): void {
    this.routes.forEach((route, index) => {
      console.log(`Routes number: ${index}\n${route.getJsonString()}\n`);
    });
  }

  private createRoutesObjectFromResponse(response: ResponseBodyUbike): void {
    // 循序建立Routes物件
    response.routes.forEach((singleRouteOfResponse) => {
      this.addNewRoute(singleRouteOfResponse);
    });
  }
}
