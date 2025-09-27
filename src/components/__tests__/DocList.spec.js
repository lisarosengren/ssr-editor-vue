import { test, expect, vi } from 'vitest';
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils';
import DocList from '../DocList.vue';
import { getAll } from '@/models/docs';

// mocking the docs
vi.mock('@/models/docs', () => ({
  getAll: vi.fn()
}));

const mockPush = vi.fn();

test('that component renders list of doc links', async () => {
  getAll.mockResolvedValueOnce([
    { _id: '1234', title: 'Test doc 1'},
    { _id: '5678', title: 'Test doc 2'}
  ]);

  const wrapper = mount(DocList, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  });
  await flushPromises();

  const mockDocs = wrapper.findAll('li');
  expect(mockDocs).toHaveLength(2);
  expect(mockDocs[0].text()).toContain('Test doc 1');
});

test('that onClick is called when link is clicked', async () => {
    getAll.mockResolvedValueOnce([
    { _id: '1234', title: 'Test doc 1'},
  ]);

  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  const wrapper = mount(DocList, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  });

  await flushPromises();

  const mockLink = wrapper.findComponent(RouterLinkStub);
  await mockLink.trigger('click');

  expect(consoleSpy).toHaveBeenCalledWith('Clicked');

  consoleSpy.mockRestore();
});
