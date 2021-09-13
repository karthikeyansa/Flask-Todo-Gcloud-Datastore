import React from 'react';
import { shallow } from 'enzyme';
import NoteCreator from '../NotesCreator';
import renderer from 'react-test-renderer';

const simulateOnChangeInput = (wrapper, inputSelector, newValue) =>{
    wrapper.find(inputSelector).first().simulate('change', {
        target: { value: newValue},
    })
    return wrapper.find(inputSelector).first();
}

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
    });

    it('maingrids Div', () => {
        const wrapper = shallow(<NoteCreator />);
        const content = simulateOnChangeInput(wrapper, "div.maingrid input#content", "hello world");
        expect(content.props().value).toEqual("hello world");
        const addNoteButton = wrapper.find("div.maingrid button#submit").first();
        expect(addNoteButton.text()).toEqual("➕Add to notes");
    })
})

describe('NoteCreator', () => {
    it('should render without crashing as per in snapshot NoteCreator', () => {
        const tree = renderer.create(<NoteCreator />).toJSON();
        expect(tree).toMatchSnapshot();
    })
})