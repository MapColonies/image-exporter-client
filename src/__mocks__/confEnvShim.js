if (!window._env_) {
  window._env_ = (function (undefined) {
    return {
      LANGUAGE: 'en',
      MAP_SERVER: 'MAP_SERVER',
      PUBLISH_POINT: 'PUBLISH_POINT',
      CHANNEL: 1002,
      VERSION: 1,
      REQUEST: 'REQUEST',
      SERVICE_PROTOCOL: 'SERVICE_PROTOCOL',
      SERVICE_NAME: 'SERVICE_NAME',
      ACTIVE_LAYER: 'ACTIVE_LAYER',
      BBOX: {
        limit: 20000,
      },
      EXPORT: {
        defaultZoomLevel: 18,
        maxZoomLevel: 22
      },
      MAP: {
        center: [35.14, 31.39],
        zoom: 8,
      },
      ACTIVE_LAYER_PARAMS: {
        urlPattern : 'URL_PATTERN',
        matrixSet: 'MATRIX_SET',
        style: 'STYLE',
        projection: 'PROJECTTION',
        format: 'FORMAT'
      },
    };
  })(void 0);
}
