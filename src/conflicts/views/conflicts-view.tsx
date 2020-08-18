import React from 'react';
import {
  VectorLayer,
  VectorSource,
  MapFilterContainer,
  GeoJSONFeature,
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { useStore } from '../models/rootStore';
// import { DateFilter } from '../components/date-filter';
// import { HasResolvedFilter } from '../components/has-resolved-filter';
// import { ConflictsTable } from '../components/conflicts-table';

const ConflictsView: React.FC = observer(() => {
  const { conflictsStore } = useStore();
  const handleExport = () => {
    console.log('conflictsStore.searchParams--->', conflictsStore.searchParams);
  }
  return (
    <MapFilterContainer
      handlePolygonSelected={conflictsStore.searchParams.setLocation}
      handlePolygonReset={conflictsStore.searchParams.resetLocation.bind(
        conflictsStore.searchParams
      )}
      // children={<ConflictsTable />}
      // filters={[<DateFilter />, <HasResolvedFilter />]}
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

export default ConflictsView;
