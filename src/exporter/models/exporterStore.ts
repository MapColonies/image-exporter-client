/* eslint-disable camelcase */
import { types, Instance, flow, getParent, getSnapshot } from 'mobx-state-tree';
import { Polygon } from '@turf/helpers';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/ResponseState';
import {
  ExportStoreError,
  ExporterError,
} from '../../common/models/exportStoreError';
import { getLayerUrl } from '../../common/helpers/layer-url';
// import MOCK_EXPORTED_PACKAGES from '../../__mocks-data__/exportedPackages';
import { searchParams } from './search-params';
import { IRootStore } from './rootStore';
import { IExportTaskStatus } from './exportTaskStatus';

export type ExportTaskStatusResponse = IExportTaskStatus[];
export interface ExportResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface PackageInfo {
  directoryName: string;
  packName: string;
  sizeEst: number;
  tilesEst: number;
  minZoom?: number;
  maxZoom?: number;
}

export type ExporterResponse = ApiHttpResponse<ExportResult>;

export const exporterStore = types
  .model({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    searchParams: types.optional(searchParams, {}),
    exportedPackages: types.maybe(types.frozen<any>([])),
    error: types.maybeNull(
      types.model({
        name: types.enumeration<ExportStoreError>(
          'Error',
          Object.values(ExportStoreError)
        ),
        message: types.string,
      })
    ),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getParent(self);
    },
  }))
  .actions((self) => {
    const startExportGeoPackage: (
      packInfo: PackageInfo
    ) => Promise<void> = flow(function* startExportGeoPackage(
      packInfo: PackageInfo
    ): Generator<Promise<ExporterResponse>, void, ExporterResponse> {
      self.state = ResponseState.PENDING;
      const snapshot = getSnapshot(self.searchParams);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: Record<string, unknown> = {};
      // Prepare body data for request
      params.directoryName = packInfo.directoryName;
      params.fileName = packInfo.packName;
      params.sizeEst = packInfo.sizeEst;
      params.tilesEst = packInfo.tilesEst;
      params.exportedLayers = [{ exportType: 'raster', url: getLayerUrl() }];
      const coordinates = (snapshot.geojson as Polygon).coordinates[0];
      params.bbox = [
        coordinates[0][0],
        coordinates[0][1],
        coordinates[2][0],
        coordinates[2][1],
      ];

      try {
        const result = yield self.root.fetch(
          '/exportGeopackage',
          'POST',
          params
        );
        // const responseBody = result.data.data;
        self.state = ResponseState.DONE;
      } catch (error) {
        self.state = ResponseState.ERROR;
      }
    });
    const getGeoPackages: () => Promise<void> = flow(
      function* getGeoPackages(): Generator<
        Promise<ExporterResponse>,
        void,
        ExportTaskStatusResponse
      > {
        try {
          self.state = ResponseState.IDLE;
          const result = yield self.root.fetch('/exportStatus', 'GET', {});
          // const result = yield Promise.resolve(MOCK_EXPORTED_PACKAGES);
          self.exportedPackages = result;
        } catch (error) {
          self.state = ResponseState.ERROR;
        }
      }
    );
    const setError = (error: ExporterError): void => {
      self.error = error;
    };

    return {
      startExportGeoPackage,
      getGeoPackages,
      setError,
    };
  });

export interface IConflictsStore extends Instance<typeof exporterStore> {}
