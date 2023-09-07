import { LatLng } from './api_interface';

export type SingleRouteOfResponseBody = {
  legs: Array<{
    steps: Array<{
      distanceMeters: number;
      staticDuration: string;
      startLocation: {
        latLng: LatLng;
      };
      endLocation: {
        latLng: LatLng;
      };
      transitDetails?: {
        stopDetails: {
          arrivalStop: { name: string };
          departureStop: { name: string };
        };
        transitLine: {
          name: string;
          vehicle: {
            name: { text: string };
            type: string;
          };
        };
      };
      travelMode: string;
    }>;
  }>;
  distanceMeters: number;
  duration: string;
};

export type TravelMode = 'WALK' | 'BUS' | 'SUBWAY' | 'LONG_DISTANCE_TRAIN';

export type Step = {
  mode: TravelMode;
  distanceMeters: number;
  durationSeconds: number;
  startLatLng: LatLng;
  endLatLng: LatLng;
};

export type RouteType = {
  steps: Array<Step>;
  distanceMeters: number;
  duration: number;
};

// For parse travel mode
export type RawStepForParseMode = {
  transitDetails?: {
    stopDetails: {
      arrivalStop: { name: string };
      departureStop: { name: string };
    };
    transitLine: {
      name: string;
      vehicle: {
        name: { text: string };
        type: string;
      };
    };
  };
  travelMode: string;
};
