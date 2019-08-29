import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../client/App';
import MealOption from '../client/MealOption';
import Category from '../client/Category';
import Dish from '../client/Dish';
import sample from '../database/sampleData';

Enzyme.configure({ adapter: new Adapter() });

describe('App component', () => {
  const fakeState = {
    menuData: sample,
    menuView: [{ Brunch: true }, { Dinner: false }, { Dessert: false}, { Cheese: false }],
  };

  test('renders', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });

  //doesn't work, needs to be refactored ಠ_ಠ
  test('it should change state', () => {
    const wrapper = mount(<App states={fakeState} />);
    wrapper
      .find('#Dinner')
      .simulate('click');
    expect('Selection of Brandy').exists();
  });
});

describe('MealOption', () => {
  const mockFn = jest.fn();
  test('button click calls a fn', () => {
    const component = shallow(<MealOption changeMeal={mockFn} key="Brunch" />);
    component
      .simulate('click');
    expect(mockFn).toHaveBeenCalled();
  });
});

describe('Category', () => {
  test('renders', () => {
    const wrapper = shallow(<Category category="Dessert" dishes={[['Salmon Sauce', { description: 'rich and creamy', price: '1000' }]]} />);
    expect(wrapper.exists()).toBe(true);
  });
});

describe('Dish', () => {
  test('renders', () => {
    const wrapper = shallow(<Dish name="Peanut Butter and Jelly" description="nutty" price="999" />);
    expect(wrapper.exists()).toBe(true);
  });
});
