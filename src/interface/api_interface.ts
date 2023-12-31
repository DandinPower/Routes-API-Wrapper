// Request Body Type
type TravelMode = 'TRANSIT' | 'DRIVE' | 'BICYCLE' | 'WALK' | 'TWO_WHEELER';
type Units = 'IMPERIAL' | 'METRIC';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type RequestBody = {
  origin: {
    location: {
      latLng: LatLng;
    };
  };
  destination: {
    location: {
      latLng: LatLng;
    };
  };
  travelMode: TravelMode;
  computeAlternativeRoutes: boolean;
  languageCode: string;
  units: Units;
};

// Request Header Type
export type RequestHeader = {
  'X-Goog-Api-Key': string;
  'Content-Type': 'application/json';
  'X-Goog-FieldMask': string;
};

// Response Type
export type ResponseBodyUbike = {
  routes: Array<{
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
  }>;
};
