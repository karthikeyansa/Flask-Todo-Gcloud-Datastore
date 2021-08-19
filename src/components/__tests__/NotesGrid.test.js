import React from 'react'
import { shallow } from 'enzyme'

import NotesGrid from '../NotesGrid'

describe('NotesGrid', () => {
  it('should render', () => {
    const wrapper = shallow(<NotesGrid />)
    expect(wrapper.exists()).toBeTruthy();
  })
})


describe('NotesGrid', () => {
  it('displaygrid', () => {
    const wrapper = shallow(<NotesGrid />)
    expect(wrapper.find("#displaygrid")).toBeTruthy();
    expect(wrapper.find("#displaygrid").find(".displaygridcell")).toBeTruthy();
  })
})