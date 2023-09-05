import { LatLng } from './src/interface';
import { GetRoutes } from './src/routes';

async function sendHttpRequest() {
  const originLatLng: LatLng = {
    latitude: 25.048611088953038,
    longitude: 121.51685493128674
  };
  const destinationLatLng: LatLng = {
    latitude: 25.042611925171517,
    longitude: 121.56383226466977
  };

  await GetRoutes(originLatLng, destinationLatLng);
}

sendHttpRequest();
