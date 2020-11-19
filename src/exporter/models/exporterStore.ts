/* eslint-disable camelcase */
import { types, Instance, flow, getParent, getSnapshot } from 'mobx-state-tree';
import { Polygon } from '@turf/helpers';
import { AxiosRequestConfig } from 'axios';
import { ApiHttpResponse } from '../../common/models/api-response';
import { ResponseState } from '../../common/models/ResponseState';
import {
  ExportStoreError,
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
  minZoom?: number;
  maxZoom?: number;
}

export type ExporterResponse = ApiHttpResponse<ExportResult>;

const internalError = types.model({
  request: types.maybe(types.frozen<AxiosRequestConfig>()),
  key: types.frozen<ExportStoreError>(),
});
export interface IInternalError extends Instance<typeof internalError> {}

export const exporterStore = types
  .model({
    state: types.enumeration<ResponseState>(
      'State',
      Object.values(ResponseState)
    ),
    searchParams: types.optional(searchParams, {}),
    exportedPackages: types.maybe(types.frozen<any>([])),
    errors: types.frozen<IInternalError[]>([]),
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
        if (error.response) {
          addError({
            request: error.config as AxiosRequestConfig,
            key: error.response.data as ExportStoreError,
          });
        } else {
          addError({
            request: error.config,
            key: ExportStoreError.GENERAL_ERROR
          });
        }
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

    const addError = (error: IInternalError): void => {
      self.errors = [...self.errors, error];
    };

    const hasError = (key: ExportStoreError): boolean => {
      return Boolean(self.errors.find(err => err.key === key));
    }

    const hasErrors = (): boolean => {
      return self.errors.length > 0;
    }

    const cleanError = (key: ExportStoreError): boolean => {
      if (hasError(key)) {
        self.errors = self.errors.filter(err => err.key !== key);
        return true;
      }
      return false;
    }

    const cleanErrors = (): void => {
      self.errors = [];
    }

    return {
      startExportGeoPackage,
      getGeoPackages,
      addError,
      hasError,
      hasErrors,
      cleanError,
      cleanErrors
    };
  });

export interface IConflictsStore extends Instance<typeof exporterStore> {}
