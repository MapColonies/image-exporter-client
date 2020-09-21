import React, { useState, useEffect } from 'react';
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
import { Button, Snackbar, SnackbarAction } from '@map-colonies/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { Polygon } from 'geojson';
import { useStore } from '../models/rootStore';
import { MapContainer } from '../components/map-container';
import EXPORTER_CONFIG from '../../common/config';
import { ExportDialog } from '../components/export/export-dialog';
import { ResponseState } from '../../common/models/ResponseState';

const wmtsOptions = getWMTSOptions({
    attributions: EXPORTER_CONFIG.WMTS_LAYER.ATTRIBUTIONS,
    url: EXPORTER_CONFIG.WMTS_LAYER.URL,
    layer: EXPORTER_CONFIG.WMTS_LAYER.LAYER,
    projection: EXPORTER_CONFIG.WMTS_LAYER.PROJECTION,
    format: EXPORTER_CONFIG.WMTS_LAYER.FORMAT,
  });

const wmsOptions = getWMSOptions({
    //url: 'https://ahocevar.com/geoserver/wms',
    url: 'http://10.28.11.125/blue_m_flat2d-v001/wms',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    // params: {'LAYERS': 'ne:NE1_HR_LC_SR_W_DR', 'TILED': true},
    params: {'LAYERS': '[blue_m_flat2d-v001]:1002', 'TILED': true},
    serverType: 'geoserver',
    // Countries have transparency, so do not fade tiles:
    transition: 0.5,
  });

const xyzOptions =  getXYZOptions({
    // url:
    // 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
    // '?apikey=0e6fc415256d4fbb9b5166a718591d71',
    url: 'http://10.28.11.125/blue_m_flat2d-v001/query?request=ImageryMaps&channel=1002&version=1&x={x}&y={y}&z={z}',
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
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackDetails, setSnackDetails] = useState<SnackDetails>({message:''});
  const intl = useIntl();
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
            exporterStore.searchParams.geojson && <ExportDialog 
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
                  onClick={(): void => console.log('dismiss clicked')}
                />
              }
            />
          }
        </>
      ]}
      mapContent={
        <>
          {/* <TileLayer>
            <TileWMTS options={wmtsOptions}/>
          </TileLayer> */}
          {/* <TileLayer options={tileOtions}>
            <TileWMS options={wmsOptions}/>
          </TileLayer> */}
          <TileLayer options={tileOtions}>
            <TileXYZ options={xyzOptions}/>
          </TileLayer>
        </>
      
      }
    />
  );
});

export default ExporterView;
