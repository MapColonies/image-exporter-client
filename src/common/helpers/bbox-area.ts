import area from '@turf/area';
import { Polygon } from 'geojson';
import EXPORTER_CONFIG from '../../common/config';

export function isBBoxWithinLimit(bbox: Polygon): boolean {
  const kmSqToMSq = 1000000; // 1000 * 1000
  // Check if bbox area is within square kilometer limit bound
  return area(bbox) <= EXPORTER_CONFIG.BOUNDARIES.AREA * kmSqToMSq;
}
