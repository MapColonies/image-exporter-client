import { types, Instance } from 'mobx-state-tree';

export enum ExportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

const bbox = types.model({
  topRight: types.model({
    lat: types.number,
    lon: types.number,
  }),
  bottomLeft: types.model({
    lat: types.number,
    lon: types.number,
  }),
});

export const exportTaskStatus = types.model({
  fileName: types.string,
  sizeEst: types.number,
  tilesEst: types.number,
  status: types.enumeration<ExportStatus>(
    'status',
    Object.values(ExportStatus)
  ),
  bbox: bbox,
  link: types.string,
  creationDate: types.Date,
  lastUpdateTime: types.Date,
  progress: types.number,
  taskId: types.string,
});

export interface IExportTaskStatus extends Instance<typeof exportTaskStatus> {}

export interface IBbox extends Instance<typeof bbox> {}
