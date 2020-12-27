/*eslint-disable */
const LANGUAGE = (window as any)._env_.LANGUAGE;
const MAP_SERVER = (window as any)._env_.MAP_SERVER;
const PUBLISH_POINT = (window as any)._env_.PUBLISH_POINT;
const CHANNEL = (window as any)._env_.CHANNEL;
const VERSION = (window as any)._env_.VERSION;
const REQUEST = (window as any)._env_.REQUEST;
const SERVICE_PROTOCOL = (window as any)._env_.SERVICE_PROTOCOL;
const SERVICE_NAME = (window as any)._env_.SERVICE_NAME;
const ACTIVE_LAYER = (window as any)._env_.ACTIVE_LAYER;
const ACTIVE_LAYER_PARAMS = (window as any)._env_.ACTIVE_LAYER_PARAMS;
const EXPORT = (window as any)._env_.EXPORT;
const MAP = (window as any)._env_.MAP;
const BBOX = (window as any)._env_.BBOX;

const EXPORTER_CONFIG = {
  SERVICE_PROTOCOL: SERVICE_PROTOCOL,
  SERVICE_NAME: SERVICE_NAME,
  I18N: {
    DEFAULT_LANGUAGE: LANGUAGE,
  },
  BOUNDARIES: {
    AREA: BBOX.limit,
  },
  EXPORT: {
    AVG_TILE_SIZE_MB: 0.02,
    DEFAULT_ZOOM: EXPORT.defaultZoomLevel as number,
    MIN_ZOOM: 0,
    MAX_ZOOM: EXPORT.maxZoomLevel as number,
    METRIX_SET_FACTOR: 2,
    POLLING_CYCLE_INTERVAL: 3000,
    MAX_FRACTION_DIGITS: 5
  },
  MAP: {
    CENTER: MAP.center as [number, number],
    ZOOM: MAP.zoom as number,
    LOOKUPS: {
      LEVEL_RESOLUTION: [
        { zoom: 0, pixel_size_meters: 78271.52 },
        { zoom: 1, pixel_size_meters: 39135.76 },
        { zoom: 2, pixel_size_meters: 19567.88 },
        { zoom: 3, pixel_size_meters: 9783.94 },
        { zoom: 4, pixel_size_meters: 4891.97 },
        { zoom: 5, pixel_size_meters: 2445.98 },
        { zoom: 6, pixel_size_meters: 1222.99 },
        { zoom: 7, pixel_size_meters: 611.5 },
        { zoom: 8, pixel_size_meters: 305.75 },
        { zoom: 9, pixel_size_meters: 152.87 },
        { zoom: 10, pixel_size_meters: 76.44 },
        { zoom: 11, pixel_size_meters: 38.22 },
        { zoom: 12, pixel_size_meters: 19.11 },
        { zoom: 13, pixel_size_meters: 9.55 },
        { zoom: 14, pixel_size_meters: 4.78 },
        { zoom: 15, pixel_size_meters: 2.39 },
        { zoom: 16, pixel_size_meters: 1.19 },
        { zoom: 17, pixel_size_meters: 0.6 },
        { zoom: 18, pixel_size_meters: 0.3 },
        { zoom: 19, pixel_size_meters: 0.15 },
        { zoom: 20, pixel_size_meters: 0.075 },
        { zoom: 21, pixel_size_meters: 0.037 },
      ],
    },
  },
  ACTIVE_LAYER: ACTIVE_LAYER, // | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_DEFAULT'
  WMTS_LAYER: {
    ATTRIBUTIONS: `Tiles © <a href="${MAP_SERVER}/service?REQUEST=GetCapabilities">MapProxy</a>`,
    URL: `${MAP_SERVER}/${ACTIVE_LAYER_PARAMS.urlPattern}`,
    LAYER: `${PUBLISH_POINT}`,
    MATRIX_SET: `${ACTIVE_LAYER_PARAMS.matrixSet}`,
    STYLE: `${ACTIVE_LAYER_PARAMS.style}`,
    PROJECTION: `${ACTIVE_LAYER_PARAMS.projection}`,
    FORMAT: `${ACTIVE_LAYER_PARAMS.format}`,
  },
  WMS_LAYER: {
    ATTRIBUTIONS: `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL: `${MAP_SERVER}/${PUBLISH_POINT}/wms`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PARAMS: {
      SERVICE: 'WMS',
      LAYERS: `[${PUBLISH_POINT}]:${CHANNEL}`,
      TILED: true,
    },
    SERVERTYPE: 'geoserver',
    TRANSITION: 0.5,
  },
  XYZ_LAYER: {
    ATTRIBUTIONS: `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL: `${MAP_SERVER}/${PUBLISH_POINT}/query?request=${REQUEST}&channel=${CHANNEL}&version=${VERSION}&x={x}&y={y}&z={z}`,
  },
};

export default EXPORTER_CONFIG;
