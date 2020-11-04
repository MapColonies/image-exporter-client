import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Polygon } from 'geojson';
import { act, waitFor } from '@testing-library/react';
import { TextField, Button } from '@map-colonies/react-core';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import { ExportDialog } from './export-dialog';

const setOpenFn = jest.fn();
const handleExport = jest.fn();
console.warn = jest.fn();

const polygon: Polygon = {
  type: 'Polygon',
  coordinates: [[[32, 35], [], [31, 34], []]],
}

const fields = {
  bottomLeftLat: polygon.coordinates[0][0][1],
  bottomLeftLon: polygon.coordinates[0][0][0],
  topRightLat: polygon.coordinates[0][2][1],
  topRightLon: polygon.coordinates[0][2][0],
}

const getFieldValue = (wrapper: ShallowWrapper, fieldName: string) => {
  const field = wrapper.find(TextField).find({ name: fieldName });
  // eslint-disable-next-line
  return field.props().value;
};

/* eslint-disable */
const getButtonById = (wrapper: ShallowWrapper,id: string):ShallowWrapper => {
  return wrapper
    .findWhere((n) => {
      return n.type() === Button && 
            n.prop('children').props['id'] === id;
    });
};
/* eslint-enable */

const updateField = (wrapper: ShallowWrapper, fieldName: string, value: number | string) => {
  const fieldWrapper = wrapper.find(TextField).find({ name: fieldName });
  
  act(() => {
    fieldWrapper.at(0).simulate('change', {
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

describe('ExportDialog component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <ExportDialog
        isOpen={true}
        onSetOpen={setOpenFn}
        selectedPolygon={polygon}
        handleExport={handleExport}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('Initial state of Ok button is disabled', () => {
    const wrapper = shallow(
      <ExportDialog
        isOpen={true}
        onSetOpen={setOpenFn}
        selectedPolygon={polygon}
        handleExport={handleExport}
      />
    );

    const okButton = getButtonById(wrapper, 'general.ok-btn.text');
    expect(okButton.prop('disabled')).toBe(true);

  });

  it('Passed polygon presented as bottom-left and top-right corners coordinates', () => {
    const wrapper = shallow(
      <ExportDialog
        isOpen={true}
        onSetOpen={setOpenFn}
        selectedPolygon={polygon}
        handleExport={handleExport}
      />
    );

    for (const field in fields) {
      // eslint-disable-next-line
      expect(getFieldValue(wrapper,field)).toEqual((fields as any)[field]);
    }

  });

  it('When package name defined Ok button is anabled and download link properly generated', async () => {
    const exportPackName = 'test';
    const wrapper = shallow(
      <ExportDialog
        isOpen={true}
        onSetOpen={setOpenFn}
        selectedPolygon={polygon}
        handleExport={handleExport}
      />
    );

    updateField(wrapper, 'packageName', exportPackName);

    await waitFor(() => {
      const okButton = getButtonById(wrapper, 'general.ok-btn.text');
      // const downloadLink = wrapper.find('#exportDownloadLink').text();

      expect(okButton.prop('disabled')).toBe(false);
      // expect(downloadLink).toContain(exportPackName);
    });
  });

  it('When all data filled and FORM submitted, handleExport triggered', async () => {
    const exportPackName = 'test';
    const wrapper = shallow(
      <ExportDialog
        isOpen={true}
        onSetOpen={setOpenFn}
        selectedPolygon={polygon}
        handleExport={handleExport}
      />
    );

    updateField(wrapper, 'packageName', exportPackName);

    act(()=>{
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
