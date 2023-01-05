/* eslint-disable import/no-extraneous-dependencies */
import '../custom.d.ts';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });