import { types, Instance } from 'mobx-state-tree';

export enum ExportStoreError {
  BBOX_AREA_TOO_LARGE = 'BBox area too large',
}

const exporterError = types.maybeNull(
  types.model({
    name: types.enumeration<ExportStoreError>(
      'Error',
      Object.values(ExportStoreError)
    ),
    message: types.string,
  })
);

export type ExporterError = Instance<typeof exporterError>;
