import { test, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DocList from '../DocList.vue';
import { getAll } from '@/models/docs';

// mocking the docs
vi.mock('@/models/docs', () => ({
  getAll: vi.fn()
}));

test('mock docs', async () => {
  // const mockRouter = { push: vi.fn() };
  getAll.mockResolvedValueOnce([
    { _id: '1234', title: 'Test doc 1'},
    { _id: '5678', title: 'Test doc 2'}
  ]);

  const wrapper = mount(DocList, {
    // global: {
    //   mocks: {
    //     $router: mockRouter
    //   },
    //   stubs: {
    //     RouterLink: true
    //   }
    // }
  });
  await flushPromises();

  const mockDocs = wrapper.findAll('li');
  expect(mockDocs).toHaveLength(2);
  expect(mockDocs[0].text()).toContain('Test doc 1');
});
