import { test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import UpdateDoc from '../UpdateDoc.vue';
import { getOne } from '@/models/docs';

// mock useRoute and getOne
vi.mock('@/models/docs', () => ({
  getOne: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}));

test('that title and content are set correctly', async () => {
  const mockDoc = {
    _id: 'mockid',
    title: 'mock title',
    content: 'mock content'
  };

  getOne.mockResolvedValueOnce(mockDoc);

  const wrapper = mount(UpdateDoc, {
    global: {
      mocks: {
        $route: {
          params: { id: 'mockid'}
        },
        $router: {
          push: vi.fn()
        }
      }
    }
  });

  await flushPromises();

  expect(getOne).toHaveBeenCalledWith('mockid');
  expect(wrapper.find('input[type="text"]').element.value).toBe('mock title');
  expect(wrapper.find('textarea').element.value).toBe('mock content');

  await flushPromises();

});
