import { RawStepForParseMode, TravelMode } from '../interface';

export function parseRawDuration(rawDuration: string): number {
  const result = rawDuration.match(/\d+/);
  if (result) {
    return parseInt(result[0], 10);
  } else {
    throw new Error('No numeric value found in the string');
  }
}

export function parseMode(
  rawStepForParseMode: RawStepForParseMode
): TravelMode {
  if (rawStepForParseMode.travelMode == 'WALK') {
    return 'WALK';
  } else if (rawStepForParseMode.travelMode == 'TRANSIT') {
    let type: string | undefined =
      rawStepForParseMode.transitDetails?.transitLine.vehicle.type;
    if (type == 'SUBWAY') {
      return 'SUBWAY';
    } else if (type == 'BUS') {
      return 'BUS';
    } else if (type == 'LONG_DISTANCE_TRAIN') {
      return 'LONG_DISTANCE_TRAIN';
    } else {
      throw Error(`Unknown Transit Mode: ${type}! Not implemented yet`);
    }
  } else {
    throw Error('Unknown Travel Mode! Not implemented yet');
  }
}
