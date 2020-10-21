import React, { useState, useEffect } from 'react';
import {
  TileLayer,
  TileWMTS,
  TileWMS,
  TileXYZ,
  TileOsm,
  getWMTSOptions,
  getWMSOptions,
  getXYZOptions
} from '@map-colonies/react-components';
import { observer } from 'mobx-react-lite';
import { Button, Snackbar, SnackbarAction } from '@map-colonies/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { Polygon } from 'geojson';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import EXPORTER_CONFIG from '../../common/config';
import { ExportDialog } from '../components/export/export-dialog';
import { ResponseState } from '../../common/models/ResponseState';
import { ExportSatusTableDialog } from '../components/export-table/export-table-dialog';
import logger from '../../logger/logger';

type ServerType = 'geoserver' | 'carmentaserver' | 'mapserver' | 'qgis';

const wmtsOptions = getWMTSOptions({
    attributions: EXPORTER_CONFIG.WMTS_LAYER.ATTRIBUTIONS,
    url: EXPORTER_CONFIG.WMTS_LAYER.URL,
    layer: EXPORTER_CONFIG.WMTS_LAYER.LAYER,
    projection: EXPORTER_CONFIG.WMTS_LAYER.PROJECTION,
    format: EXPORTER_CONFIG.WMTS_LAYER.FORMAT,
  });

const wmsOptions = getWMSOptions({
  attributions: EXPORTER_CONFIG.WMS_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.WMS_LAYER.URL,
  params: EXPORTER_CONFIG.WMS_LAYER.PARAMS,
  serverType: EXPORTER_CONFIG.WMS_LAYER.SERVERTYPE as ServerType,
  transition: EXPORTER_CONFIG.WMS_LAYER.TRANSITION,
});

const xyzOptions =  getXYZOptions({
  attributions: EXPORTER_CONFIG.XYZ_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.XYZ_LAYER.URL,
});

const tileOtions = {opacity:0.5};

interface SnackDetails {
  message: string;
}

const ExporterView: React.FC = observer(() => {
  const { exporterStore } = useStore();
  const onExportClick = ():void => {
    setOpen(true);
  }
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackDetails, setSnackDetails] = useState<SnackDetails>({message:''});
  const intl = useIntl();
  const onExportStatusClick= ():void => {
    setOpenStatus(true);
  }
  useEffect(()=>{
    switch(exporterStore.state){
      case ResponseState.ERROR:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.failed',
        });
        break;
      case ResponseState.DONE:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.success',
        })
        break;
      default:
        break;
    }
  },[exporterStore.state]);

  return (
    <MapContainer
      handlePolygonSelected={exporterStore.searchParams.setLocation}
      handlePolygonReset={exporterStore.searchParams.resetLocation.bind(
        exporterStore.searchParams
      )}
      filters={[
        <>
          <Button 
            raised 
            disabled={exporterStore.searchParams.geojson ? false : true} 
            onClick={onExportClick}>
            <FormattedMessage id="export.export-btn.text"/>
          </Button>
          {
            exporterStore.searchParams.geojson && open && <ExportDialog 
              isOpen={open}
              onSetOpen={setOpen}
              selectedPolygon={exporterStore.searchParams.geojson as Polygon}
              handleExport={exporterStore.startExportGeoPackage}>
            </ExportDialog>
          }
          {
            !!snackDetails.message && <Snackbar
              open={snackOpen}
              onClose={(evt): void => setSnackOpen(false)}
              message={intl.formatMessage({ id: snackDetails.message })}
              dismissesOnAction
              action={
                <SnackbarAction
                  label={intl.formatMessage({ id: 'snack.dismiss-btn.text' })}
                  onClick={() => logger.info('dismiss clicked')}
                />
              }
            />
          }
          <Button 
            raised 
            onClick={onExportStatusClick}>
            <FormattedMessage id="export.export-status-btn.text"/>
          </Button>
          <ExportSatusTableDialog
            isOpen={openStatus}
            onSetOpen={setOpenStatus}>
          </ExportSatusTableDialog>
        </>
      ]}
      mapContent={
        <>
          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'OSM_DEFAULT' && <TileLayer>
              <TileOsm />
            </TileLayer>
          }
          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'WMTS_LAYER' && <TileLayer>
              <TileWMTS options={wmtsOptions}/>
            </TileLayer> 
          }
          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'WMS_LAYER' && <TileLayer options={tileOtions}>
              <TileWMS options={wmsOptions}/>
            </TileLayer>
          }

          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'XYZ_LAYER' &&<TileLayer options={tileOtions}>
              <TileXYZ options={xyzOptions}/>
            </TileLayer> 
          }
        </>
      
      }
    />
  );
});

export default ExporterView;
