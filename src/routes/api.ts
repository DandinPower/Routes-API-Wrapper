import { RequestBody, RequestHeader, LatLng, ResponseBody } from '../interface';
import axios from 'axios';
import 'dotenv/config';

const GOOGLE_MAP_KEY: string = process.env.GOOGLE_MAP_KEY as string;
const FIELD_MASK: string =
  'routes.distanceMeters,routes.duration,routes.legs.stepsOverview.multiModalSegments.navigationInstruction,routes.legs.stepsOverview.multiModalSegments.travelMode,routes.legs.steps.distanceMeters,routes.legs.steps.navigationInstruction,routes.legs.steps.travelMode,routes.legs.steps.transitDetails.stopDetails.arrivalStop.name,routes.legs.steps.transitDetails.stopDetails.departureStop.name,routes.legs.steps.transitDetails.transitLine.name,routes.legs.steps.transitDetails.transitLine.vehicle.name,routes.legs.steps.transitDetails.transitLine.vehicle.type';
const COMPUTE_ROUTES_URL: string =
  'https://routes.googleapis.com/directions/v2:computeRoutes';

function displayApiResponse(response: ResponseBody): void {
  response.routes.forEach((route, routeIndex) => {
    console.log(`Route ${routeIndex + 1}:`);

    route.legs.forEach((leg) => {
      leg.steps.forEach((step) => {
        if (step.travelMode === 'WALK') {
          console.log(
            `Walk ${step.distanceMeters} meters: ${step.navigationInstruction.instructions}`
          );
        } else if (step.travelMode === 'TRANSIT') {
          console.log(
            `Take ${step.transitDetails!.transitLine.vehicle.name.text} (${
              step.transitDetails!.transitLine.name
            }) from ${step.transitDetails!.stopDetails.departureStop.name} to ${
              step.transitDetails!.stopDetails.arrivalStop.name
            }.`
          );
        }
      });
    });
    console.log(`Total Distance: ${route.distanceMeters} meters`);
    console.log(`Duration: ${route.duration}`);
    console.log('---------------------------------------------');
  });
}

export async function GetRoutes(
  originLatLng: LatLng,
  destinationLatLng: LatLng
): Promise<void> {
  const body: RequestBody = {
    origin: {
      location: {
        latLng: originLatLng
      }
    },
    destination: {
      location: {
        latLng: destinationLatLng
      }
    },
    travelMode: 'TRANSIT',
    computeAlternativeRoutes: true,
    languageCode: 'zh-TW',
    units: 'IMPERIAL'
  };
  const header: RequestHeader = {
    'X-Goog-Api-Key': GOOGLE_MAP_KEY,
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': FIELD_MASK
  };
  try {
    const response = await axios.post(COMPUTE_ROUTES_URL, body, {
      headers: header
    });
    const responseObject = response.data as ResponseBody;
    displayApiResponse(responseObject);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
