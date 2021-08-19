import React from 'react'
import { shallow } from 'enzyme'

import NoteCreator from '../NotesCreator'

describe('NoteCreator', () => {
  it('should render', () => {
      const wrapper = shallow(<NoteCreator />)
      expect(wrapper.exists()).toBeTruthy();
  })
})

describe('NoteCreator', () => {
    it('Get Title', () => {
        const wrapper = shallow(<NoteCreator />);
        expect(wrapper.find("h1").text()).toBe("Welcome to Notes")
    })
})

describe('NoteCreator', () => {
    it('Check options', () => {
        const wrapper = shallow(<NoteCreator />);
        expect(wrapper.find(".options")).toBeTruthy();
        expect(wrapper.find(".options").find(".primary-btn").text()).toBe("Profile");
        expect(wrapper.find(".options").find(".danger-btn").text()).toBe("Logout");
    })
})

describe('NoteCreator', () => {
    it('Alerts Div', () => {
        const wrapper = shallow(<NoteCreator />);
        expect(wrapper.find("#alerts")).toBeTruthy();
    })
})

describe('NoteCreator', () => {
    it('maingrid Div', () => {
        const wrapper = shallow(<NoteCreator />);
        expect(wrapper.find("#maingrid")).toBeTruthy();
        expect(wrapper.find("#maingrid").find("#content")).toBeTruthy();
        expect(wrapper.find("#maingrid").find("#inputTask")).toBeTruthy();
        expect(wrapper.find("#maingrid").find("#inputTask").find("task1")).toBeTruthy();
        expect(wrapper.find("#maingrid").find("#inputTask")).toBeTruthy();
        expect(wrapper.find("#maingrid").find("#button")).toBeTruthy();
    })
})