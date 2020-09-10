/*eslint-disable */
const EXPORTER_CONFIG = {
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
    MAX_ZOOM: 20,
  },
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
  }
}

export default EXPORTER_CONFIG;
