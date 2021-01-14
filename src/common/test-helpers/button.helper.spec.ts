import { Button } from "@map-colonies/react-core";
import { ReactWrapper } from "enzyme";

/* eslint-disable */
export const getButtonById = (wrapper: ReactWrapper, id: string): ReactWrapper => {
  return wrapper
    .findWhere((n) => {
      return n.type() === Button &&
        n.prop('children').props['id'] === id;
    });
};
/* eslint-enable */

describe.skip('Button helpers dummy suite', () => {
  it('dummy test', () => {
    expect(true).toBe(true);
  });
});