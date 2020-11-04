import { ExportStatus } from "../exporter/models/exportTaskStatus";

const MOCK_EXPORTED_PACKAGES = [
  {
    fileName: 'kuku',
    sizeEst: 23,
    tilesEst: 120,
    status: ExportStatus.COMPLETED,
    link: 'https://packages/kuku.gpkg',
    creationDate: new Date('2020-10-01T03:24:00'),
    lastUpdateTime: new Date('2020-10-01T03:24:00'),
    progress: 100,
    bbox: {
      topRight:{
        lat: 31.5,
        lon: 35,
      },
      bottomLeft: {
        lat: 32,
        lon: 34,
      },
    },
    taskId: '11111111',
  },
  {
    fileName: 'muku',
    sizeEst: 345,
    tilesEst: 2000,
    status: ExportStatus.IN_PROGRESS,
    link: 'https://packages/muku.gpkg',
    creationDate: new Date('2020-09-30T02:24:00'),
    lastUpdateTime: new Date('2020-10-01T03:24:00'),
    progress: 80,
    bbox: {
      topRight:{
        lat: 31.5,
        lon: 35,
      },
      bottomLeft: {
        lat: 32,
        lon: 34,
      },
    },
    taskId: '2222222',
  },
];

export default MOCK_EXPORTED_PACKAGES;
