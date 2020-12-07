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
const DEFAULT_ZOOM_LEVEL: number = (window as any)._env_.DEFAULT_ZOOM_LEVEL;
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
    DEFAULT_ZOOM: DEFAULT_ZOOM_LEVEL,
    MIN_ZOOM: 0,
    MAX_ZOOM: 22,
    METRIX_SET_FACTOR: 2,
    POLLING_CYCLE_INTERVAL: 3000,
  },
  ACTIVE_LAYER: ACTIVE_LAYER, // | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' | 'OSM_DEFAULT'
  WMTS_LAYER: {
    ATTRIBUTIONS:
      'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/' +
      'services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>',
    URL:
      'https://services.arcgisonline.com/arcgis/rest/' +
      'services/Demographics/USA_Population_Density/MapServer/WMTS/',
    LAYER: '0',
    PROJECTION: 'EPSG:3857',
    FORMAT: 'image/png',
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
