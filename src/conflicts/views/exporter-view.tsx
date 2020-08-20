import React from 'react';
import {
  VectorLayer,
  VectorSource,
  GeoJSONFeature,
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';

const ExporterView: React.FC = observer(() => {
  const { conflictsStore } = useStore();
  const handleExport = () => {
    console.log('conflictsStore.searchParams--->', conflictsStore.searchParams);
  }
  return (
    <MapContainer
      handlePolygonSelected={conflictsStore.searchParams.setLocation}
      handlePolygonReset={conflictsStore.searchParams.resetLocation.bind(
        conflictsStore.searchParams
      )}
      filters={[<div style={{width:'50px',height:'36px',backgroundColor: 'red'}} onClick={handleExport}/>]}
      mapContent={
        <VectorLayer>
          <VectorSource>
            {conflictsStore.conflicts.map((conflict, index) => (
              <GeoJSONFeature key={index} geometry={conflict.location} />
            ))}
          </VectorSource>
        </VectorLayer>
      }
    />
  );
});

export default ExporterView;
