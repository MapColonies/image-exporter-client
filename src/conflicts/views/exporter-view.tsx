import React from 'react';
import {
  TileLayer,
  TileWMTS,
  getWMTSOptions
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import EXPORTER_CONFIG from '../../common/config';

const ExporterView: React.FC = observer(() => {
  const { conflictsStore } = useStore();
  const handleExport = () => {
    console.log('conflictsStore.searchParams--->', conflictsStore.searchParams);
  }

  const wmtsOptions = getWMTSOptions({
    attributions: EXPORTER_CONFIG.WMTS_LAYER.ATTRIBUTIONS,
    url: EXPORTER_CONFIG.WMTS_LAYER.URL,
    layer: EXPORTER_CONFIG.WMTS_LAYER.LAYER,
    projection: EXPORTER_CONFIG.WMTS_LAYER.PROJECTION,
    format: EXPORTER_CONFIG.WMTS_LAYER.FORMAT,
  });

  return (
    <MapContainer
      handlePolygonSelected={conflictsStore.searchParams.setLocation}
      handlePolygonReset={conflictsStore.searchParams.resetLocation.bind(
        conflictsStore.searchParams
      )}
      filters={[<div style={{width:'50px',height:'36px',backgroundColor: 'red'}} onClick={handleExport}/>]}
      mapContent={
        <TileLayer>
          <TileWMTS options={wmtsOptions}/>
        </TileLayer>
      }
    />
  );
});

export default ExporterView;
