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
import { ExportStoreError } from '../../common/models/exportStoreError';
import { BBoxAreaLimit } from '../../common/helpers/bbox-area';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

import { get as getProjection } from 'ol/proj';
import { getWidth, getTopLeft } from 'ol/extent';


type ServerType = 'geoserver' | 'carmentaserver' | 'mapserver' | 'qgis';

// const RESOLUTIONS = 20,
//   TILE_GRANULARITY = 256,
//   WMTS_RESOLUTION_BASIS = 2,
//   LAYER_HEIGHT_WIDHT_RATIO = 2;

// const projection = getProjection('EPSG:4326');
// const projectionExtent = projection.getExtent();
// let resolutions =[];// new Array<number>(RESOLUTIONS);
// let matrixIds = new Array<string>(RESOLUTIONS);
// const size = getWidth(projectionExtent) / TILE_GRANULARITY;
// for (let z = 0; z < RESOLUTIONS; ++z) {
//   // generate resolutions and matrixIds arrays for this WMTS
//   resolutions[z] = (size / Math.pow(WMTS_RESOLUTION_BASIS, z))/LAYER_HEIGHT_WIDHT_RATIO;
//   matrixIds[z] = z.toString();
// }


//   //  resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
//   //       0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625,
//   //       0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 8.58306884765625e-05,
//   //       4.291534423828125e-05, 2.1457672119140625e-05, 1.0728836059570312e-05,
//   //       5.364418029785156e-06, 2.682209014892578e-06, 1.341104507446289e-06,
//   //       6.705522537231445e-07, 3.3527612686157227e-07];
//   //  matrixIds = ['0','1','2','3','4','5','6','7','8','9',
//   //                   '10','11','12','13','14','15','16','17','18','19','20', '21'];
// const wmtsOptions = {
//   tileGrid:  new WMTSTileGrid({
//     resolutions: resolutions,
//       matrixIds: matrixIds,
//       origin: getTopLeft(projectionExtent),
//       // tileSize: 256
//     }),
//   // name: "WMTS combined_layers",
//   url: 'http://10.28.11.95:8080/wmts/{Layer}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
//   layer: 'combined_layers', 
//   matrixSet: 'gridname',
//   format: 'png',
//   // isBaseLayer: true,
//   style: 'default',
//   requestEncoding: 'REST',
// };



const wmtsOptions = getWMTSOptions({
  attributions: EXPORTER_CONFIG.WMTS_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.WMTS_LAYER.URL,
  layer: EXPORTER_CONFIG.WMTS_LAYER.LAYER,
  projection: EXPORTER_CONFIG.WMTS_LAYER.PROJECTION,
  format: EXPORTER_CONFIG.WMTS_LAYER.FORMAT,
  matrixSet: EXPORTER_CONFIG.WMTS_LAYER.MATRIX_SET,
  style: EXPORTER_CONFIG.WMTS_LAYER.STYLE,
});

// const wmtsOptions = {
//     ...wmtsOptionsBasis,
//     // tileGrid:  new WMTSTileGrid({
//     //   resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
//     //     0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625,
//     //     0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 8.58306884765625e-05,
//     //     4.291534423828125e-05, 2.1457672119140625e-05, 1.0728836059570312e-05,
//     //     5.364418029785156e-06, 2.682209014892578e-06, 1.341104507446289e-06,
//     //     6.705522537231445e-07, 3.3527612686157227e-07],
//     //     matrixIds: ['0','1','2','3','4','5','6','7','8','9',
//     //                 '10','11','12','13','14','15','16','17','18','19','20', '21'],
//     //     tileSize: [256, 256]    
//     //     }),
//     name: "WMTS combined_layers",
//     url: 'http://10.28.11.95:8080/wmts/combined_layers/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png',
//     layer: 'combined_layers',
//     matrixSet: 'gridname',
//     format: 'png',
//     isBaseLayer: true,
//     style: 'default',
//     requestEncoding: 'REST',
// };

const wmsOptions = getWMSOptions({
  attributions: EXPORTER_CONFIG.WMS_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.WMS_LAYER.URL,
  params: EXPORTER_CONFIG.WMS_LAYER.PARAMS,
  serverType: EXPORTER_CONFIG.WMS_LAYER.SERVERTYPE as ServerType,
  transition: EXPORTER_CONFIG.WMS_LAYER.TRANSITION,
});

const xyzOptions = getXYZOptions({
  attributions: EXPORTER_CONFIG.XYZ_LAYER.ATTRIBUTIONS,
  url: EXPORTER_CONFIG.XYZ_LAYER.URL,
});

interface SnackDetails {
  message: string;
}

const ExporterView: React.FC = observer(() => {
  const { exporterStore } = useStore();
  const onExportClick = (): void => {
    setOpen(true);
  }
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [isDrawDisabled, setDrawDisabled] = useState(false);
  const [snackDetails, setSnackDetails] = useState<SnackDetails>({ message: '' });
  const intl = useIntl();
  const onExportStatusClick = (): void => {
    setOpenStatus(true);
  }
  useEffect(() => {
    switch (exporterStore.state) {
      case ResponseState.DONE:
        setSnackOpen(true);
        setSnackDetails({
          message: 'snack.message.success',
        })
        break;
      default:
        break;
    }
  }, [exporterStore.state]);

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.GENERAL_ERROR)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.failed',
      });
    }
  }, [exporterStore, exporterStore.errors]);

  useEffect(() => {
    if (exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_LARGE)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.failed.draw.bbox.large',
      });
    }
    else if (exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_SMALL)) {
      setSnackOpen(true);
      setSnackDetails({
        message: 'snack.message.failed.draw.bbox.small',
      });
    }
  }, [exporterStore, exporterStore.errors]);

  const handleError = (isWithinLimit : BBoxAreaLimit): void => {
    const key = isWithinLimit === BBoxAreaLimit.TOO_BIG ? ExportStoreError.BBOX_AREA_TOO_LARGE : ExportStoreError.BBOX_AREA_TOO_SMALL;
    exporterStore.addError({
      key: key,
      request: undefined
    });
  }

  return (
    <MapContainer
      selectionPolygon={exporterStore.searchParams.geojson as Polygon}
      handlePolygonSelected={exporterStore.searchParams.setLocation}
      handlePolygonReset={exporterStore.searchParams.resetLocation.bind(
        exporterStore.searchParams
      )}
      handleError={handleError}
      isDrawDisabled={isDrawDisabled}
      filters={[
        <>
          <Button
            raised
            disabled={exporterStore.searchParams.geojson && !isDrawDisabled ? false : true}
            onClick={onExportClick}>
            <FormattedMessage id="export.export-btn.text" />
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
            !!snackOpen && <Snackbar
              open={snackOpen}
              onOpen={(): void => {
                if (exporterStore.hasErrors()) {
                  setDrawDisabled(true);
                } else {
                  // on success (no errors)
                  exporterStore.searchParams.resetLocation();
                  setOpen(false);
                }
              }}
              onClose={(evt): void => {
                if (exporterStore.hasErrors()) {
                  if (exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_LARGE) || 
                      exporterStore.hasError(ExportStoreError.BBOX_AREA_TOO_SMALL)) {
                    exporterStore.searchParams.resetLocation();
                  }
                  setDrawDisabled(false);
                  exporterStore.cleanErrors();
                }
                setSnackOpen(false);
              }}
              message={intl.formatMessage({ id: snackDetails.message })}
              dismissesOnAction
              action={
                <SnackbarAction
                  label={intl.formatMessage({ id: 'snack.dismiss-btn.text' })}
                />
              }
            />
          }
          <Button
            raised
            onClick={onExportStatusClick}>
            <FormattedMessage id="export.export-status-btn.text" />
          </Button>
          {
            openStatus && <ExportSatusTableDialog
              isOpen={openStatus}
              onSetOpen={setOpenStatus}>
            </ExportSatusTableDialog>
          }
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
              <TileWMTS options={wmtsOptions} />
            </TileLayer>
          }
          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'WMS_LAYER' && <TileLayer>
              <TileWMS options={wmsOptions} />
            </TileLayer>
          }

          {
            EXPORTER_CONFIG.ACTIVE_LAYER === 'XYZ_LAYER' && <TileLayer>
              <TileXYZ options={xyzOptions} />
            </TileLayer>
          }
        </>

      }
    />
  );
});

export default ExporterView;
