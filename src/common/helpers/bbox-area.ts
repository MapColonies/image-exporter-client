import area from '@turf/area';
import { Polygon } from 'geojson';
import EXPORTER_CONFIG from '../../common/config';

export enum BBoxAreaLimit {
  OK,
  TOO_BIG,
  TOO_SMALL,
}

export function isBBoxWithinLimit(bbox: Polygon): BBoxAreaLimit {
  const kmSqToMSq = 1000000; // 1000 * 1000
  const limit = EXPORTER_CONFIG.BOUNDARIES.AREA * kmSqToMSq;
  const polygonArea = area(bbox);
  let isInLimit = BBoxAreaLimit.OK;

  // Check if bbox area is larger than square kilometer limit bound
  if (polygonArea > limit) {
    isInLimit = BBoxAreaLimit.TOO_BIG;
  }
  // Check if bbox area is smaller than 1 sq meter
  else if (polygonArea < 1) {
    isInLimit = BBoxAreaLimit.TOO_SMALL;
  }

  return isInLimit;
}
