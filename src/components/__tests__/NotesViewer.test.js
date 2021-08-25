import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

import NotesViewer from '../NotesViewer';
import renderer from 'react-test-renderer';

const simulateOnChangeInput = (wrapper, inputSelector, newValue) =>{
  wrapper.find(inputSelector).first().simulate('change', {
      target: { value: newValue},
  })
  return wrapper.find(inputSelector).first();
}

// const simulateClick = (wrapper, buttonSelector, eventAction) => {
//   wrapper.find(buttonSelector).first().simulate(eventAction)
//   return wrapper.find(buttonSelector).first();
// }

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
      expect(wrapper.find(".noteViewerGrid #newTaskTextarea")).toBeTruthy();
  })
})

describe('NotesViewer', () => {
  const holder = document.createElement('div');
  document.body.appendChild(holder);
  
  const note = {id: 1, content: "Hello world", 
                  tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                          {task_id: 2, description: "this is task 2", status: false}]};

  it('Note renderning and close actions block', () =>{
    const wrapper = mount(<NotesViewer note={note} />, { attachTo: holder });
    const closeModelButtton = wrapper.find("button.modalCloseButton.danger-btn").first();
    expect(closeModelButtton.text()).toBe("Close");

    wrapper.unmount();

  })
})

describe('NoteViewer', () =>{
  const holder = document.createElement('div');
  document.body.appendChild(holder);

  const mockFetch = Promise.resolve({ json: () => Promise.resolve(
    {success: true, result:[{id: 1, content: "Hello world", 
                            tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                                    {task_id: 2, description: "this is task 2", status: false}]},
                            {id: 2, content: "Hello mars", 
                            tasks: [{task_id: 1, description: "this is task 3", status: true}, 
                                    {task_id: 2, description: "this is task 4", status: true}]}]
    })
  });
  global.fetch = jest.fn().mockImplementation(() => mockFetch);

  const minprops = {
    note : {id: 1, content: "Hello world", 
                    tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                            {task_id: 2, description: "this is task 2", status: false}]}
  }

  beforeEach(()=>{
    jest.useFakeTimers();
  })

  afterEach(()=>{
    jest.runAllTimers();
  })

  it('Note renderer update Note Content and task description', () => {

    const wrapper = mount(<NotesViewer {...minprops}/>, { attachTo: holder });
    
    simulateOnChangeInput(wrapper, "div.noteViewerGrid textarea#NoteContent", "hello mars");
    const checkStatusButton = wrapper.find("div.noteViewerGrid div#incompleteTasks span#span2").first();
    checkStatusButton.simulate('click');
    const taskDescriptionUpdate = wrapper.find("div.noteViewerGrid div#incompleteTasks textarea.taskTextarea").first();
    taskDescriptionUpdate.simulate('blur');
    const trashButton = wrapper.find("div.noteViewerGrid div#incompleteTasks span#trash2").first();
    trashButton.simulate('click');
    //Error Handling 
    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("textarea.newtexareaPadding").simulate("change", {target: { value: 'this is new task'}});
    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("textarea.newtexareaPadding").first();
    expect(wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("textarea.newtexareaPadding").text()).toBe("this is new task");

    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("div.newTaskButtonGrid button.newNoteButtons.success-btn").simulate('click')
    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("div.newTaskButtonGrid button.newNoteButtons.danger-btn").simulate('click')

    const checkStatusButtonCompleted = wrapper.find("div.noteViewerGrid div#completeTasks span#span1").first();
    checkStatusButtonCompleted.simulate('click');
    const taskDescriptionUpdateCompleted = wrapper.find("div.noteViewerGrid div#completeTasks textarea.taskTextarea").first();
    taskDescriptionUpdateCompleted.simulate('blur');
    const trashButtonCompleted = wrapper.find("div.noteViewerGrid div#completeTasks span#trash1").first();
    trashButtonCompleted.simulate('click');

    wrapper.unmount();
  })
})

describe("NoteViewer", () => {
  let wrapper;
  beforeEach(()=>{
    const mockFetch = Promise.resolve({ json: () => Promise.resolve(
    {success: true, result:{
      id: 1, content: "Hello world", 
      tasks: [{task_id: 1, description: "this is task 1", status: true}, 
              {task_id: 2, description: "this is task 2", status: false}]
    }
    })
    });

    global.fetch = jest.fn().mockImplementation(() => mockFetch);
  
    const minprops = {
      note : {id: 1, content: "Hello world", 
                      tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                              {task_id: 2, description: "this is task 2", status: false}]}
    }

    wrapper = mount(<NotesViewer {...minprops} />);
  })

  it("Note rendenering new task description", () => {
    expect(wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("textarea.newtexareaPadding").exists()).toBeTruthy();
    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("textarea.newtexareaPadding").simulate("change", {target: { value: 'this is task one'}});
    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("textarea.newtexareaPadding").first();
    expect(wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("textarea.newtexareaPadding").text()).toBe("this is task one");

    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("div.newTaskButtonGrid button.newNoteButtons.success-btn").simulate('click')
    wrapper.find("div.noteViewerGrid").find("div.newTaskTextarea").find("div.newTaskButtonGrid button.newNoteButtons.danger-btn").simulate('click')
  })

  afterEach(()=>{
    jest.clearAllMocks();
    wrapper.unmount();
  })
})


describe('NotesViewer', () => {
  it('should render without crashing as per in snapshot', () => {
    const tree = renderer.create(<NotesViewer note={note}/>).toJSON();
    expect(tree).toMatchSnapshot();
  })

})