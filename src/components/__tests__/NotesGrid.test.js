import React from 'react';
import { mount, shallow } from 'enzyme';
import NotesGrid from '../NotesGrid';
import renderer from 'react-test-renderer';

describe('NotesGrid', () => {
  it('should render', () => {
    const wrapper = shallow(<NotesGrid />)
    expect(wrapper.exists()).toBeTruthy();
  })
})


describe('NotesGrid', () => {
  it('displaygrid rendering without crashing', () => {
    const wrapper = shallow(<NotesGrid />);
    expect(wrapper.find("#displaygrid").exists()).toBeTruthy();
  })

  it('displaygrid check data rendering with props old Data and new data', ()=>{
    const holder = document.createElement('div');
    document.body.appendChild(holder);

    const minprops = {
      allNotesData : [
        {id: 1, content: "Hello world", 
                tasks: [{task_id: 1, description: "this is task 1", status: true},
                        {task_id: 2, description: "this is task 2", status: false}]},
        {id: 2, content: "Hello mars", 
        tasks: [{task_id: 1, description: "go to mars", status: true},
                {task_id: 2, description: "drop bomb on the poles", status: false},
                {task_id: 3, description: "colonize mars", status: true}]}
      ],
      pushUpdatedNote : {id: 123, content: "sample hello world", 
                           tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                                   {task_id: 2, description: "this is task 2", status: false}]},
      Newnote : null
    }

    const wrapper = mount(<NotesGrid {...minprops}/>, { attachTo: holder });
    expect(wrapper.find("div.displaygrid div.displaygridcell div#noteContent").exists()).toBeTruthy();
    const story1 = wrapper.find("div.displaygrid div.displaygridcell div#noteContent").first();
    expect(story1.text()).toBe(minprops.allNotesData[0].content);

    const storyOneDelete = wrapper.find("div.displaygrid div.displaygridcell span.danger-btn").first();
    expect(storyOneDelete.text()).toBe("🗑️");
    const storyOneTasksCount = wrapper.find("div.displaygrid div.displaygridcell span#statusHolder").first();
    expect(storyOneTasksCount.text()).toBe("Status: ❌Ongoing(1) ✔Completed(1)");

    const story2 = wrapper.find("div.displaygrid div.displaygridcell div#noteContent").at(1);
    expect(story2.text()).toBe(minprops.allNotesData[1].content);
    const storyTwoDelete = wrapper.find("div.displaygrid div.displaygridcell span.danger-btn").at(1);
    expect(storyTwoDelete.text()).toBe("🗑️");
    const storyTwoTasksCount = wrapper.find("div.displaygrid div.displaygridcell span#statusHolder").at(1);
    expect(storyTwoTasksCount.text()).toBe("Status: ❌Ongoing(1) ✔Completed(2)");

    const story2Remover = wrapper.find("div.displaygrid div.displaygridcell div span.danger-btn").first();
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({success: true}) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    story2Remover.simulate('click')

    wrapper.unmount();
  })
})

describe('NotesGrid', () => {
  it('displaygrid check data rendering with props new data only', ()=>{
    const holder = document.createElement('div');
    document.body.appendChild(holder);

    const oneprops = {
      Newnote : [{id: 123, content: "sample one hello world", 
                           tasks: [{task_id: 1, description: "this is task 1", status: true}, 
                                   {task_id: 2, description: "this is task 2", status: false}]
      }],
    }

    const wrapper = mount(<NotesGrid {...oneprops}/>, { attachTo: holder });
    expect(wrapper.find("div.displaygrid div.displaygridcell div#noteContent").exists()).toBe(true);
  })
})

describe('NotesGrid', () => {
  it('displaygrid check data rendering with no props data', ()=>{
    const holder = document.createElement('div');
    document.body.appendChild(holder);
    
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({success: true}) });
    global.fetch = jest.fn().mockImplementation(() => mockFetch);

    const wrapper = mount(<NotesGrid/>, { attachTo: holder });
    expect(wrapper.html()).toEqual(`<div class="displaygrid" id="displaygrid"></div>`);
  })
})

describe('NotesGrid', () => {
  it('should render without crashing as per in snapshot NotesGrid', () => {
      const tree = renderer.create(<NotesGrid />).toJSON();
      expect(tree).toMatchSnapshot();
  })
})