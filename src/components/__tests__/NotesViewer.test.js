import React from 'react';
import { shallow } from 'enzyme';

import NotesViewer from '../NotesViewer';
import renderer from 'react-test-renderer';

describe('NotesViewer', () => {
  it('should render', () => {
    const note = {id: 1, content: "Hello world", 
                  tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                          {task_id: 2, description: "this is task 2", status: false}]}
    const wrapper = shallow(<NotesViewer note={note} />)
    expect(wrapper.exists()).toBeTruthy();
  })
})


describe('NotesViewer', () => {
  it('Alerts Div', () => {
    const note = {id: 1, content: "Hello world", 
                  tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                          {task_id: 2, description: "this is task 2", status: false}]}
      const wrapper = shallow(<NotesViewer note={note} />);
      expect(wrapper.find("#alerts").text()).toBe("");
      expect(wrapper.find("button").find(".modalCloseButton").text()).toBe("Close");
  })
})

describe('NotesViewer', () => {
  it('Viewer Grid', () => {
    const note = {id: 1, content: "Hello world", 
                  tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                          {task_id: 2, description: "this is task 2", status: false}]}
      const wrapper = shallow(<NotesViewer note={note} />);
      expect(wrapper.find(".noteViewerGrid")).toBeTruthy();
      expect(wrapper.find(".noteViewerGrid").find("#NoteContent").text()).toBe("");
      expect(wrapper.find(".noteViewerGrid").find("#incompleteTaskCount").text()).toBe("");
      expect(wrapper.find(".noteViewerGrid").find("#incompleteTasks").text()).toBe("❌🗑️");
      expect(wrapper.find(".noteViewerGrid").find("#completeTaskCount").text()).toBe("");
      expect(wrapper.find(".noteViewerGrid").find("#completeTasks").text()).toBe("✔🗑️");
  })
})

describe('NotesViewer', () => {
  const note = {id: 1, content: "Hello world", 
                  tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                          {task_id: 2, description: "this is task 2", status: false}]};
  it('New Task Textarea', () => {
      const wrapper = shallow(<NotesViewer note={note} />);
      expect(wrapper.find(".noteViewerGrid")).toBeTruthy();
      expect(wrapper.find(".noteViewerGrid").find("#newTaskTextarea")).toBeTruthy();
  })
})

describe('NotesViewer', () => {
  it('should render without crashing as per in snapshot', () => {
    const tree = renderer.create(<NotesViewer note={note}/>).toJSON();
    expect(tree).toMatchSnapshot();
  })

})