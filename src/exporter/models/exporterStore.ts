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
import { searchParams } from './search-params';
import { IRootStore } from './rootStore';

export interface ExportResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
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
    const startExportGeoPackage: () => Promise<void> = flow(
      function* startExportGeoPackage(): Generator<
        Promise<ExporterResponse>,
        void,
        ExporterResponse
      > {
        self.state = ResponseState.PENDING;
        const snapshot = getSnapshot(self.searchParams);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, unknown> = {};
        params.layers = [{layerType: 'raster', layerUrl: 'http://alex.rasterLayerUrl.com'}];
        params.bbox = [
          (snapshot.geojson as Polygon).coordinates[0], 
          (snapshot.geojson as Polygon).coordinates[2]
        ];

        try {
          const result = yield self.root.fetch('/geoPackageExporter', params);
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
