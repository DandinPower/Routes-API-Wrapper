import {
  RequestBody,
  RequestHeader,
  LatLng,
  ResponseBodyUbike
} from '../interface';
import axios from 'axios';
import 'dotenv/config';

const GOOGLE_MAP_KEY: string = process.env.GOOGLE_MAP_KEY as string;
const FIELD_MASK_UBIKE: string =
  'routes.legs.steps,routes.distanceMeters,routes.duration';
const COMPUTE_ROUTES_URL: string =
  'https://routes.googleapis.com/directions/v2:computeRoutes';

export async function GetRoutesUbike(
  originLatLng: LatLng,
  destinationLatLng: LatLng
): Promise<ResponseBodyUbike> {
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
    'X-Goog-FieldMask': FIELD_MASK_UBIKE
  };
  try {
    const response = await axios.post(COMPUTE_ROUTES_URL, body, {
      headers: header
    });
    const responseObject = response.data as ResponseBodyUbike;
    return responseObject;
  } catch (error: any) {
    console.error('Error fetching data:', error);

    if (error && error.response) {
      throw new Error(
        `API Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else if (error && error.request) {
      throw new Error(
        'No response received from the API. Please check the network connection.'
      );
    } else {
      throw new Error('There was an error sending the request.');
    }
  }
}
