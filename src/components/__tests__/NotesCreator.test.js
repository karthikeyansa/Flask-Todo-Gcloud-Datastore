import React from 'react';
import { mount, shallow } from 'enzyme';
import NoteCreator from '../NotesCreator';
import renderer from 'react-test-renderer';

const simulateOnChangeInput = (wrapper, inputSelector, newValue) =>{
    wrapper.find(inputSelector).first().simulate('change', {
        target: { value: newValue},
    })
    return wrapper.find(inputSelector).first();
}

const simulateClick = (wrapper, buttonSelector, eventAction) => {
    wrapper.find(buttonSelector).first().simulate(eventAction)
    return wrapper.find(buttonSelector).first();
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

    it('maingrids Div', async() => {
        const holder = document.createElement('div');
        document.body.appendChild(holder);

        // Noraml Input case
        // global.fetch = jest.fn(() => Promise.resolve({json: () => ''}));
        const mockFetch = Promise.resolve({ json: () => Promise.resolve({success: true}) });
        global.fetch = jest.fn().mockImplementation(() => mockFetch);

        const wrapper = mount(<NoteCreator />, { attachTo: holder });
        const content = simulateOnChangeInput(wrapper, "div.maingrid input#content", "hello world");
        expect(content.props().value).toEqual("hello world");
        
        const task1 = simulateOnChangeInput(wrapper, "div.maingrid div#inputTask textarea#task1", "task 1");
        task1.simulate('keyDown', {keyCode: 13})
        task1.simulate('keyDown', {keyCode: 13, shiftKey: true})
        expect(task1.props().value).toEqual("task 1");

        const addNoteButton = wrapper.find("div.maingrid button#submitButton").first();
        expect(addNoteButton.text()).toEqual("➕Add to notes");
        addNoteButton.simulate('click');

        simulateClick(wrapper, "div.maingrid div#inputTask span#span1", 'click');
        
        // Error input case
        const contentError = simulateOnChangeInput(wrapper, "div.maingrid input#content", "");
        expect(contentError.props().value).toEqual("");

        jest.useFakeTimers();
        addNoteButton.simulate('click');
        jest.runAllTimers();

        delete window.location;
        window.location = { assign: jest.fn() };

        simulateClick(wrapper, "div.options button.primary-btn", 'click');
        simulateClick(wrapper, "div.options button.danger-btn", 'click');

        wrapper.unmount();
    })
})

describe('NoteCreator', () => {
    it('should render without crashing as per in snapshot NoteCreator', () => {
        const tree = renderer.create(<NoteCreator />).toJSON();
        expect(tree).toMatchSnapshot();
    })
})