import { types, Instance } from 'mobx-state-tree';

export enum ExportStoreError {
  BBOX_AREA_TOO_LARGE = 'BBOX_TOO_LARGE',
  GENERAL_ERROR = 'GENERAL_ERROR_OCCURED',
  DUPLICATE_PATH = 'ERR_EXPORT_DATA_DUPLICATION'
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
