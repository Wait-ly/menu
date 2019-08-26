import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../client/App';

Enzyme.configure({ adapter: new Adapter() });

describe('App component', () => {
  test('renders', () => {
    const wrapper = shallow(<App />);

    expect(wrapper.exists()).toBe(true);
  })
})