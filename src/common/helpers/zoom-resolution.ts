import EXPORTER_CONFIG from '../../common/config';

const getResolutionInMeteres = (zoomLevel: number): number | string => {
  const zoom = EXPORTER_CONFIG.MAP.LOOKUPS.LEVEL_RESOLUTION.find(zoomObject => zoomObject.zoom === zoomLevel);

  return zoom?.pixel_size_meters ?? 'UNMAPPED';
};

export { getResolutionInMeteres };
