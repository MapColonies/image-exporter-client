import MOCK_EXPORTED_PACKAGES from '../../__mocks-data__/exportedPackages';
import { ResponseState } from '../../common/models/ResponseState';
// eslint-disable-next-line
import '../../__mocks__/confEnvShim';
import { rootStore } from './rootStore';
import { GeoPackageResponse } from './exporterStore';

console.error = jest.fn();
console.log = jest.fn();

const exportedPackages: GeoPackageResponse = MOCK_EXPORTED_PACKAGES as GeoPackageResponse;

describe('Exporter Store', () => {
  it('return an array of exported packages in a result of FETCH', async () => {
    const packagesFetcher = async (): Promise<GeoPackageResponse> =>
      Promise.resolve<GeoPackageResponse>(exportedPackages);
    const { exporterStore } = rootStore.create({}, { fetch: packagesFetcher });
  
    await exporterStore.getGeoPackages();

    const result:GeoPackageResponse = exporterStore.exportedPackages as GeoPackageResponse;
  
    expect(result).toEqual(exportedPackages);
  });

  it('status is DONE when export package trigered succesfully', async () => {
    const { exporterStore } = rootStore.create({}, { 
      fetch: async () =>  Promise.resolve({}),
    });

    exporterStore.searchParams.setLocation({
      type: "MultiPolygon",
      coordinates: [[[[32,35]], [[32,35]],[[31.5,34.5]],[[32,35]]]]
    });
    
    await exporterStore.startExportGeoPackage({
      packName: 'kuku',
      sizeEst: 20000,
      tilesEst: 200,
    });

    expect(exporterStore.state).toBe(ResponseState.DONE);
  });

  it('status is ERROR when export package trigered failed', async () => {
    const { exporterStore } = rootStore.create({}, { 
      fetch: async () =>  Promise.reject(),
    });

    exporterStore.searchParams.setLocation({
      type: "MultiPolygon",
      coordinates: [[[[32,35]], [[32,35]],[[31.5,34.5]],[[32,35]]]]
    });
    
    await exporterStore.startExportGeoPackage({
      packName: 'kuku',
      sizeEst: 20000,
      tilesEst: 200,
    });

    expect(exporterStore.state).toBe(ResponseState.ERROR);
  });

});
