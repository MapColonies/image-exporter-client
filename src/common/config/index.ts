/*eslint-disable */
const MAP_SERVER = 'http://10.28.11.125';
const PUBLISH_POINT = 'blue_m_flat2d-v001';
const CHANNEL = 1002;
const VERSION = 1;
const REQUEST = 'ImageryMaps';

const EXPORTER_CONFIG = {
  SERVICE_PROTOCOL: 'http://',
  SERVICE_NAME: 'localhost:8000',
  I18N:{
    DEFAULT_LANGUAGE: 'en'
  },
  BOUNDARIES: {
    MAX_X_KM: 100,
    MAX_Y_KM: 100,
  },
  EXPORT: {
    AVG_TILE_SIZE_KB: 0.02,
    MIN_ZOOM: 1,
    MAX_ZOOM: 21,
    RASTER_URL: MAP_SERVER,
  },
  ACTIVE_LAYER: 'OSM_DEFAULT', // | 'WMTS_LAYER' | 'WMS_LAYER' | 'XYZ_LAYER' |
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
    ATTRIBUTIONS:
      `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL:
     `${MAP_SERVER}/${PUBLISH_POINT}/wms`,
     // eslint-disable-next-line @typescript-eslint/naming-convention
    PARAMS: {'LAYERS': `[${PUBLISH_POINT}]:${CHANNEL}`, 'TILED': true},
    SERVERTYPE: 'geoserver',
    TRANSITION: 0.5,
  },
  XYZ_LAYER: {
    ATTRIBUTIONS:
      `Tiles © <a href="${MAP_SERVER}">GEE</a>`,
    URL:
     `${MAP_SERVER}/${PUBLISH_POINT}/query?request=${REQUEST}&channel=${CHANNEL}&version=${VERSION}&x={x}&y={y}&z={z}`,
    
  },
};

export default EXPORTER_CONFIG;
