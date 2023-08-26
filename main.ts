import axios from 'axios';
import 'dotenv/config';

const GOOGLE_MAP_KEY: string = process.env.GOOGLE_MAP_KEY as string;
const FIELD_MASK: string = 'routes.distanceMeters,routes.duration,routes.legs.stepsOverview.multiModalSegments.navigationInstruction,routes.legs.stepsOverview.multiModalSegments.travelMode,routes.legs.steps.distanceMeters,routes.legs.steps.navigationInstruction,routes.legs.steps.travelMode,routes.legs.steps.transitDetails.stopDetails.arrivalStop.name,routes.legs.steps.transitDetails.stopDetails.departureStop.name,routes.legs.steps.transitDetails.transitLine.name,routes.legs.steps.transitDetails.transitLine.vehicle.name,routes.legs.steps.transitDetails.transitLine.vehicle.type';
const COMPUTE_ROUTES_URL: string = 'https://routes.googleapis.com/directions/v2:computeRoutes';

// Request Type
type LatLng = {
    latitude: number;
    longitude: number;
};
type Location = {
    latLng: LatLng;
};
type Place = {
    location: Location;
};
type TravelMode = "TRANSIT" | "DRIVE" | "BICYCLE" | "WALK" | "TWO_WHEELER";
type Units = "IMPERIAL" | "METRIC";
type RequestBody = {
    origin: Place;
    destination: Place;
    travelMode: TravelMode;
    computeAlternativeRoutes: boolean;
    languageCode: string;
    units: Units;
};
type RequestHeader = {
    'X-Goog-Api-Key': string,
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': string 
};

// Response Type
type ApiResponse = {
    routes: Array<{
        legs: Array<{
            steps: Array<{
                distanceMeters: number,
                navigationInstruction: {
                    maneuver?: string,
                    instructions: string
                },
                transitDetails?: {
                    stopDetails: {
                        arrivalStop: { name: string },
                        departureStop: { name: string }
                    },
                    transitLine: {
                        name: string,
                        vehicle: {
                            name: { text: string },
                            type: string
                        }
                    }
                },
                travelMode: string
            }>,
            stepsOverview: {
                multiModalSegments: Array<{
                    navigationInstruction?: {
                        instructions: string
                    },
                    travelMode: string
                }>
            }
        }>,
        distanceMeters: number,
        duration: string
    }>
}

function displayApiResponse(response: ApiResponse): void {
    response.routes.forEach((route, routeIndex) => {
        console.log(`Route ${routeIndex + 1}:`);

        route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
                if (step.travelMode === 'WALK') {
                    console.log(`Walk ${step.distanceMeters} meters: ${step.navigationInstruction.instructions}`);
                } else if (step.travelMode === 'TRANSIT') {
                    console.log(`Take ${step.transitDetails!.transitLine.vehicle.name.text} (${step.transitDetails!.transitLine.name}) from ${step.transitDetails!.stopDetails.departureStop.name} to ${step.transitDetails!.stopDetails.arrivalStop.name}.`);
                }
            });
        });

        console.log(`Total Distance: ${route.distanceMeters} meters`);
        console.log(`Duration: ${route.duration}`);
        console.log('---------------------------------------------');
    });
}

class ComputeRoutesAPI {
    private body: RequestBody;
    private header: RequestHeader;

    constructor(_body: RequestBody, _header: RequestHeader) {
        this.body = _body;
        this.header = _header;
    }

    async getRoutes(): Promise<void> {
        try {
            const response = await axios.post(COMPUTE_ROUTES_URL, this.body, {
                headers: this.header,
            });
            const responseObject = response.data as ApiResponse;
            displayApiResponse(responseObject);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

async function sendHttpRequest() {
    const body: RequestBody = {
        origin: {
          location: {
            latLng: {
              latitude: 25.048611088953038,
              longitude: 121.51685493128674
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: 25.042611925171517,
              longitude: 121.56383226466977
            }
          }
        },
        travelMode: "TRANSIT",
        computeAlternativeRoutes: true,
        languageCode: "zh-TW",
        units: "IMPERIAL"
    };

    const header: RequestHeader = {
        'X-Goog-Api-Key': GOOGLE_MAP_KEY,
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': FIELD_MASK 
    }

    let computeRoutesApi = new ComputeRoutesAPI(body, header);
    await computeRoutesApi.getRoutes();
}

sendHttpRequest();