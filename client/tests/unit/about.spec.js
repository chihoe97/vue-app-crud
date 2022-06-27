import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import About from '../../src/views/About.vue';

jest.mock('axios');
let mockResponse = {
  data: {
    id: 1,
    result: 'Wikipedia has a recording of a cat meowing, because why not?',
  },
};

describe('apiComponents', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(About);
    jest.spyOn(axios, 'get').mockImplementation();
    jest.spyOn(axios, 'post').mockImplementation();
  });

  afterEach(() => {
    // mock.restore();
    jest.restoreAllMocks();
  });

  it('component is created', () => {
    // check the name of the component
    expect(wrapper.vm.$options.name).toMatch('facts');

    // check that the title is rendered
    expect(wrapper.text()).toMatch('Cat Facts');
  });

  it('get catFact', async () => {
    axios.get.mockResolvedValue(mockResponse)
    const res = await axios.get('http://localhost:3000/catFacts/get/');
    expect(res).toEqual(mockResponse);
  });

  it('get fromSource', async () => {
    axios.get.mockResolvedValue(mockResponse)
    const res = await axios.get('http://localhost:3000/catFacts/fromSource/');
    expect(res).toEqual(mockResponse);
  });
  mockResponse = {
    success: 200,
  };
  it('post create catFact', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve(mockResponse))
    const res = await axios.post('http://localhost:3000/catFacts/create/');
    expect(res).toEqual(mockResponse);
  });

  it('post update catFact', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve(mockResponse))
    const res = await axios.post('http://localhost:3000/catFacts/update/');
    expect(res).toEqual(mockResponse);
  });

  it('post delete catFact', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve(mockResponse))
    const res = await axios.post('http://localhost:3000/catFacts/delete/');
    expect(res).toEqual(mockResponse);
  });
});
