import jest from 'jest';
import { shallow, mount, render } from 'enzyme';
import letterCount from '../client/App';


test('It adds two numbers', () => {
  expect(1 + 1).toBe(2);
});

test("letterCount works with regular strings", () => {
  expect(letterCount("awesome", "e")).toBe(2);
});