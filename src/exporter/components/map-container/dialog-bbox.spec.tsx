import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { act, waitFor } from '@testing-library/react';
import 'mutationobserver-shim';
import { TextField } from '@map-colonies/react-core';
import { getFieldValue } from '../../../common/test-helpers/text-field.helper.spec';
import { getButtonById } from '../../../common/test-helpers/button.helper.spec';
// eslint-disable-next-line
import '../../../__mocks__/confEnvShim';
import { DialogBBox } from './dialog-bbox';


global.MutationObserver = window.MutationObserver;

const setOpenFn = jest.fn();
const polygonUpdate = jest.fn();

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

const updateField = (wrapper: ShallowWrapper, fieldName: string, value: number) => {
  const fieldWrapper = wrapper.find(TextField).find({ name: fieldName });
  
  act(() => {
    fieldWrapper.at(0).simulate('change', {
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

describe('DialogBBox component', () => {

  afterEach(() => {
    setOpenFn.mockClear();
    polygonUpdate.mockClear();
  });

  it('renders correctly', () => {
    const wrapper = shallow(
      <DialogBBox
        isOpen={false}
        onSetOpen={setOpenFn}
        onPolygonUpdate={polygonUpdate}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('Bbox fields filled succesfully', async () => {
    const fields = {
      bottomLeftLat: '10.1',
      bottomLeftLon: '10.1',
      topRightLat: '10.2',
      topRightLon: '10.2',
    };

    const wrapper = shallow(
      <DialogBBox
        isOpen={false}
        onSetOpen={setOpenFn}
        onPolygonUpdate={polygonUpdate}
      />
    );

    for (const field in fields) {
      // eslint-disable-next-line
      updateField(wrapper, field, (fields as any)[field]);
    }

    await waitFor(() => {
      for (const field in fields) {
        // eslint-disable-next-line
        expect(getFieldValue(wrapper,field)).toEqual((fields as any)[field]);
      }
    });
  });

  it('Cancel button triggers dialog closing', () => {
    const wrapper = shallow(
      <DialogBBox
        isOpen={false}
        onSetOpen={setOpenFn}
        onPolygonUpdate={polygonUpdate}
      />
    );

    getButtonById(wrapper, 'general.cancel-btn.text').simulate('click');

    expect(setOpenFn).toHaveBeenCalledWith(false);
  });

  it('Submiting the form triggers onPolygonUpdate', async () => {
    const wrapper = shallow(
      <DialogBBox
        isOpen={false}
        onSetOpen={setOpenFn}
        onPolygonUpdate={polygonUpdate}
      />
    ); 

    act(()=>{
      wrapper
        .find('form')
        .simulate('submit');
    });

    wrapper.update();

    await waitFor(() => {
      expect(polygonUpdate).toHaveBeenCalled();
    });
  });

  //// TODO test to check error presentation logic.
  //// When component uses useFormik() hook internal formik state not updated when triggered onChange event.
  //// Probably formik should be used in component way rather than hook.
  //// Also preferable to test such functionality on the levevl of E2E tests.
  // it('Bbox stays opened and shows ERROR when Y(km) limit is exceeded', async () => {
  //   const fields = {
  //     bottomLeftLat: 31,
  //     bottomLeftLon: 34,
  //     topRightLat: 32,
  //     topRightLon: 35,
  //   };
  //   .
  //   .
  //   .  
  //   console.log('ERROR --->', wrapper.find('#errorContainer').length);
  //   expect(wrapper.find('#errorContainer')).toBeDefined();
  // });

});
