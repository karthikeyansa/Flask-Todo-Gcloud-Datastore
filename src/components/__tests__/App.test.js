import React from 'react';
import { shallow } from 'enzyme';

import App from '../../App';
import renderer from 'react-test-renderer';

describe('App', () => {
  it('should render', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.exists()).toBeTruthy()
  })

  it("should render without crashing as per in snapshot App", ()=>{
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  })
})