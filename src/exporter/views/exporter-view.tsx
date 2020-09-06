import React from 'react';
import {
  TileLayer,
  TileWMTS,
  TileWMS,
  TileXYZ,
  getWMTSOptions,
  getWMSOptions,
  getXYZOptions
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import EXPORTER_CONFIG from '../../common/config';
import { Button } from '@map-colonies/react-core';
import { FormattedMessage } from 'react-intl';

const ExporterView: React.FC = observer(() => {
  const { exporterStore } = useStore();
  const handleExport = ():void => {
    console.log('exporterStore.searchParams--->', exporterStore.searchParams);
    void exporterStore.startExportGeoPackage(); 
  }

  const wmtsOptions = getWMTSOptions({
    attributions: EXPORTER_CONFIG.WMTS_LAYER.ATTRIBUTIONS,
    url: EXPORTER_CONFIG.WMTS_LAYER.URL,
    layer: EXPORTER_CONFIG.WMTS_LAYER.LAYER,
    projection: EXPORTER_CONFIG.WMTS_LAYER.PROJECTION,
    format: EXPORTER_CONFIG.WMTS_LAYER.FORMAT,
  });

  const wmsOptions = getWMSOptions({
    url: 'https://ahocevar.com/geoserver/wms',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    params: {'LAYERS': 'ne:NE1_HR_LC_SR_W_DR', 'TILED': true},
    serverType: 'geoserver',
    // Countries have transparency, so do not fade tiles:
    transition: 0.5,
  });

  const xyzOptions = getXYZOptions({
    url:
    'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
    '?apikey=0e6fc415256d4fbb9b5166a718591d71',
  });

  return (
    <MapContainer
      handlePolygonSelected={exporterStore.searchParams.setLocation}
      handlePolygonReset={exporterStore.searchParams.resetLocation.bind(
        exporterStore.searchParams
      )}
      filters={[
        <Button 
          raised 
          disabled={exporterStore.searchParams.geojson ? false : true} 
          onClick={handleExport}>
          <FormattedMessage id="export.export-btn.text"/>
        </Button>
      ]}
      mapContent={
        <>
          <TileLayer>
            <TileWMTS options={wmtsOptions}/>
          </TileLayer>
          <TileLayer options={{opacity:0.5}}>
            <TileWMS options={wmsOptions}/>
          </TileLayer>
          <TileLayer options={{opacity:0.5}}>
            <TileXYZ options={xyzOptions}/>
          </TileLayer>
        </>
      
      }
    />
  );
});

export default ExporterView;
