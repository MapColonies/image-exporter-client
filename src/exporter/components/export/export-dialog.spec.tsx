import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Polygon } from 'geojson';
import { act, waitFor } from '@testing-library/react';
import { TextField, Button } from '@map-colonies/react-core';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import { IntlProvider } from 'react-intl';
import MESSAGES from '../../../common/i18n';
import MOCK_EXPORTED_PACKAGES from '../../../__mocks-data__/exportedPackages';
import { ExportTaskStatusResponse } from '../../models/exporterStore';
import { rootStore, StoreProvider } from '../../models/rootStore';
import { ExportStoreError } from '../../../common/models/exportStoreError';
import { ExportDialog } from './export-dialog';
import EXPORTER_CONFIG from '../../../common/config';

const setOpenFn = jest.fn();
const handleExport = jest.fn();
console.warn = jest.fn();

const exportedPackages: ExportTaskStatusResponse = MOCK_EXPORTED_PACKAGES;
const packagesFetcher = async (): Promise<ExportTaskStatusResponse> => Promise.resolve<ExportTaskStatusResponse>(exportedPackages);

const polygon: Polygon = {
  type: 'Polygon',
  coordinates: [[[32, 35], [], [31, 34], []]],
}

const fields = {
  bottomLeftLat: polygon.coordinates[0][0][1].toFixed(EXPORTER_CONFIG.MAX_FRACTION_DIGITS),
  bottomLeftLon: polygon.coordinates[0][0][0].toFixed(EXPORTER_CONFIG.MAX_FRACTION_DIGITS),
  topRightLat: polygon.coordinates[0][2][1].toFixed(EXPORTER_CONFIG.MAX_FRACTION_DIGITS),
  topRightLon: polygon.coordinates[0][2][0].toFixed(EXPORTER_CONFIG.MAX_FRACTION_DIGITS)
}

const getFieldValue = (wrapper: ReactWrapper, fieldName: string) => {
  const field = wrapper.find(TextField).find({ name: fieldName }).find(TextField);
  // eslint-disable-next-line
  return field.props().value;
};

/* eslint-disable */
const getButtonById = (wrapper: ReactWrapper, id: string): ReactWrapper => {
  return wrapper
    .findWhere((n) => {
      return n.type() === Button &&
        n.prop('children').props['id'] === id;
    });
};
/* eslint-enable */

const updateField = (wrapper: ReactWrapper, fieldName: string, value: number | string) => {
  const fieldWrapper = wrapper.find(TextField).find({ name: fieldName }).find('input');

  act(() => {
    fieldWrapper.simulate('change', {
      nativeEvent: {
        data: value
      },
      // simulate changing e.target.name and e.target.value
      target: {
        name: fieldName,
        value
      },
    });
  });

  act(() => {
    fieldWrapper.simulate('blur');
  });
};

// Enzyme doesn’t work properly with hooks in general, especially for `shallow` so this is the way to mock `react-intl` module.
// Enspired by https://github.com/formatjs/formatjs/issues/1477
jest.mock('react-intl', () => {
  /* eslint-disable */
  const reactIntl = require.requireActual('react-intl');
  const MESSAGES = require.requireActual('../../../common/i18n');
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: MESSAGES.default['en'],
  });

  return {
    ...reactIntl,
    useIntl: () => intl,
  };
  /* eslint-enable */
});

jest.mock('../../../common/helpers/estimated-tile-list');


describe('ExportDialog component', () => {
  it('renders correctly', () => {

    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            selectedPolygon={polygon}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('Initial state of Ok button is disabled', () => {
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            selectedPolygon={polygon}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );


    const okButton = getButtonById(wrapper, 'general.ok-btn.text');
    expect(okButton.prop('disabled')).toBe(true);
  });

  it('Passed polygon presented as bottom-left and top-right corners coordinates', () => {
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            selectedPolygon={polygon}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );


    for (const field in fields) {
      // eslint-disable-next-line
      expect(getFieldValue(wrapper, field)).toEqual((fields as any)[field]);
    }

  });

  it('When package name and directory name are defined Ok button is enabled and download link properly generated', async () => {
    const exportPackName = 'test';
    const exportDirName = 'test';
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            selectedPolygon={polygon}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );

    updateField(wrapper, 'packageName', exportPackName);
    updateField(wrapper, 'directoryName', exportDirName);

    wrapper.update();

    await waitFor(() => {
      const okButton = getButtonById(wrapper, 'general.ok-btn.text');
      // const downloadLink = wrapper.find('#exportDownloadLink').text();

      expect(okButton.prop('disabled')).toBe(false);
      // expect(downloadLink).toContain(exportPackName);
    });
  });

  it('When all data filled and FORM submitted, handleExport triggered', async () => {
    const exportPackName = 'test';
    const exportDirName = 'test';
    const mockStore = rootStore.create({}, { fetch: packagesFetcher });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            selectedPolygon={polygon}
            handleExport={handleExport}
          />
        </IntlProvider>
      </StoreProvider>
    );

    updateField(wrapper, 'packageName', exportPackName);
    updateField(wrapper, 'directoryName', exportDirName);

    act(() => {
      wrapper
        .find('form')
        .simulate('submit');
    });

    wrapper.update();

    await waitFor(() => {
      expect(getButtonById(wrapper, 'general.ok-btn.text').prop('disabled')).toBe(false);
      expect(handleExport).toHaveBeenCalled();
    });
  });

  it('When all data filled and FORM submitted, export fails', async () => {
    const exportPackName = 'uniqueName';
    const exportDirName = 'uniqueName';
    const polygon: Polygon = {
      type: 'Polygon',
      coordinates: [[[35.4274677973303, 32.83433188112207], [], [35.427479676963486, 32.83434257279194], []]],
    }
    const maxZoom = 3;

    const packagesFetcherFailure = async (): Promise<ExportTaskStatusResponse> => Promise.reject<ExportTaskStatusResponse>();
    const mockStore = rootStore.create({}, { fetch: packagesFetcherFailure });

    const handleExportError = jest.fn(x => {
      mockStore.exporterStore.addError({ request: {}, key: ExportStoreError.BBOX_TOO_SMALL_FOR_RESOLUTION });
    });

    const wrapper = mount(
      <StoreProvider value={mockStore}>
        <IntlProvider locale={'en'} messages={MESSAGES['en']}>
          <ExportDialog
            isOpen={true}
            onSetOpen={setOpenFn}
            selectedPolygon={polygon}
            handleExport={handleExportError}
          />
        </IntlProvider>
      </StoreProvider>
    );

    updateField(wrapper, 'packageName', exportPackName);
    updateField(wrapper, 'directoryName', exportDirName);
    updateField(wrapper, 'maxZoom', maxZoom);

    act(() => {
      wrapper
        .find('form')
        .simulate('submit');
    });

    wrapper.update();

    await waitFor(() => {
      const errorMessage: string = MESSAGES['en']['export.dialog.bbox.resolution.validation.error.text'] as string;
      // eslint-disable-next-line
      expect(wrapper.text().includes(errorMessage)).toBe(true);
      expect(handleExportError).toHaveBeenCalled();
    });
  });

  //// TODO test to check error presentation logic.
  //// When component uses useFormik() hook internal formik state not updated when triggered onChange event.
  //// Probably formik should be used in component way rather than hook.
  //// Also preferable to test such functionality on the levevl of E2E tests.
  // it('When package name defined but one of zooms not Ok button is disabled', async () => {
  //   const exportPackName = 'test';
  //   const wrapper = shallow(
  //     <ExportDialog
  //       isOpen={true}
  //       onSetOpen={setOpenFn}
  //       selectedPolygon={polygon}
  //       handleExport={handleExport}
  //     />
  //   );

  //   updateField(wrapper, 'packageName', exportPackName);
  //   updateField(wrapper, 'minZoom', 0);

  //   wrapper.update();

  //   await waitFor(() => {
  //     const okButton = getButtonById(wrapper, 'general.ok-btn.text');
  //     expect(okButton.prop('disabled')).toBe(true);
  //   });
  // });

});
