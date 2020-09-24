/* eslint-disable camelcase */
import {
  types,
  Instance,
  flow,
  getParent,
  getSnapshot,
} from 'mobx-state-tree';
import { Polygon } from '@turf/helpers';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/ResponseState';
import EXPORTER_CONFIG from '../../common/config';
import { searchParams } from './search-params';
import { IRootStore } from './rootStore';

export interface ExportResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface PackageInfo {
  packName: string;
  minZoom?: number;
  maxZoom?: number;
}

function getParamsString(params: any) {
  const paramArray = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return paramArray.join('&');
}

function getFullUrl() {
  const activeLayer = EXPORTER_CONFIG.ACTIVE_LAYER;

  if(activeLayer === 'WMS_LAYER') {
    const wmsOptions = EXPORTER_CONFIG.WMS_LAYER;
    return `${wmsOptions.URL}?${getParamsString(wmsOptions.PARAMS)}`;
  }

  if(activeLayer === 'WMTS_LAYER') {
    const wmtsOptions = EXPORTER_CONFIG.WMTS_LAYER;
    return wmtsOptions.URL;
  }

  if(activeLayer === 'XYZ_LAYER') {
    const xyzOptions = EXPORTER_CONFIG.XYZ_LAYER;
    return xyzOptions.URL;
  }

  return 'NOT_VALID_URL';
}

export type ExporterResponse = ApiHttpResponse<ExportResult>;

export const exporterStore = types
  .model({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    searchParams: types.optional(searchParams, {}),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const startExportGeoPackage: (packInfo: PackageInfo) => Promise<void> = flow(
      function* startExportGeoPackage(packInfo: PackageInfo): Generator<
        Promise<ExporterResponse>,
        void,
        ExporterResponse
      > {
        self.state = ResponseState.PENDING;
        const snapshot = getSnapshot(self.searchParams);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, unknown> = {};
        // Prepare body data for request
        params.fileName = packInfo.packName;
        params.directoryName = 'test';
        params.exportedLayers = [{exportType: 'raster', url: getFullUrl()}];
        const coordinates = (snapshot.geojson as Polygon).coordinates[0];
        params.bbox = [coordinates[0][0], coordinates[0][1], coordinates[2][0], coordinates[2][1]];

        try {
          console.log('Fetch params--->',params);
          const result = yield self.root.fetch('/exportGeopackage', params);
          // const responseBody = result.data.data;
          self.state = ResponseState.DONE;
        } catch (error) {
          console.error(error);
          self.state = ResponseState.ERROR;
        }
      }
    );

    return {
      startExportGeoPackage,
    };
  });

export interface IConflictsStore extends Instance<typeof exporterStore> {}
