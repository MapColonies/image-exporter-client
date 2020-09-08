/* eslint-disable */
import { Polygon } from "@turf/helpers";
import * as turf from '@turf/helpers';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
const clipper = require('greiner-hormann/dist/greiner-hormann');

const limitBounds = (bbox: Array<number>) => {
  return [
    bbox[0] > -180 ? bbox[0] : -180 + 0.000001,
    bbox[1] > -85.0511 ? bbox[1] : -85.0511 + 0.000001,
    bbox[2] < 180 ? bbox[2] : 180 - 0.000001,
    bbox[3] < 85.0511 ? bbox[3] : 85.0511 - 0.000001
  ]
}

// get tile corner points and center
const tileCornersWithCenter = (z: number, x: number, y: number) => {
  var top = tile2lat(y, z)
  var left = tile2long(x, z)
  var bottom = tile2lat(y + 1, z)
  var right = tile2long(x + 1, z)
  return [
    [left, bottom],
    [right, bottom],
    [right, top],
    [left, top],
    [(left + right) / 2, (bottom + top) / 2]
  ]
}

// get tile numbers for lat, long and vice versa 
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames 
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29 (javascript code)
const long2tile = (lon: number, zoom: number) => {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}
const lat2tile = (lat: number, zoom: number) => {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}
const tile2long = (x: number, z: number) => {
  return (x / Math.pow(2, z) * 360 - 180);
}
const tile2lat = (y: number, z: number) => {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}
const getTiles = (polygon: Polygon, minZoom: number, maxZoom: number): Array<string> => {
  const res = new Array<string>();
  const onlyCorners = false;
  const zooms = Array.apply(null, Array(maxZoom - minZoom + 1)).map( (x, i) => (minZoom + i) );

  zooms.forEach(function (z) {
    //   polygons.forEach(function(poly) {
    // if (argv.tileBuffer > 0) {
    //   var dist = (256 * argv.tileBuffer) * (256/180)/Math.pow(2,z)
    //   poly = buffer(poly, dist, 'degrees').geometry
    // }
    const line = turf.lineString(polygon.coordinates[0]);
    const boundingBox = limitBounds(bbox(line));
    const top = lat2tile(boundingBox[3], z);
    const left = long2tile(boundingBox[0], z);
    const bottom = lat2tile(boundingBox[1], z);
    const right = long2tile(boundingBox[2], z);
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        //get tile corners and center
        const cornersWithCenter = tileCornersWithCenter(z, x, y);
        const anyPointIn = cornersWithCenter.some((pt) => booleanPointInPolygon(pt, polygon));
        if (anyPointIn) {
          //   console.log([z,x,y].join('/') + '.png');
          res.push([z, x, y].join('/') + '.png');
        }
        if (!anyPointIn && !onlyCorners) {
          // if tile covers polygon (like river) points would not be inside
          // but intersects with polygon
          const int = clipper.intersection(
            polygon.coordinates[0].slice(0, -1),
            cornersWithCenter.slice(0, cornersWithCenter.length - 1)); //remove ctr
          if (int) {
            //   console.log([z,x,y].join('/') + '.png');
            res.push([z, x, y].join('/') + '.png');
          }
        }
      }
    }
    //   })
  })
  return res;
}

export default getTiles;