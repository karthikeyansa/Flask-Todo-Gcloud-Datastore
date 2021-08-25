import React from 'react';
import { mount, shallow } from 'enzyme';

import App from '../../App';
import NotesCreator from '../NotesCreator';
import NotesGrid from '../NotesGrid';
import NotesViewer from '../NotesViewer';
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

describe('App', () => {
  it('App component one note is selected state', () => {
    const holder = document.createElement("div");
    document.body.appendChild(holder);

    const note = {
      id: 123,
      content : "Hello world",
      tasks: [{
        task_id: 1,
        description: "task 1",
        status : true
      },
      {
        task_id : 2,
        description : "task 2",
        status: false
      }]
    }

    global.fetch = jest.fn(() => Promise.resolve({success: true}))
    const widgets = {
      note : note,
      notesGrid: false,
      notesCreator: false,
      noteViewer: true,
      noteUpdate: null
    }
    
    const wrapper = shallow(<App />);
  })
})