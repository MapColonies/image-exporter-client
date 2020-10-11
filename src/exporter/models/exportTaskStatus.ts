import { types, Instance } from 'mobx-state-tree';

export const exportTaskStatus = types.model({
  fileName: types.string,
  sizeEst: types.number,
  tilesEst: types.number,
  status: types.string,
  link: types.string,
  date: types.Date,
  progress: types.number,
});

export interface IExportTaskStatus extends Instance<typeof exportTaskStatus> {}
