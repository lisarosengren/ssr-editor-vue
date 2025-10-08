import { test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import UpdateDoc from '../UpdateDoc.vue';
import { updateDoc, getOne } from '@/models/docs';
import { useRoute } from 'vue-router';

// mock useRoute, getOne and updateDoc
vi.mock('@/models/docs', () => ({
  getOne: vi.fn(),
  updateDoc: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}));

test('mock doc update', async () => {
  useRoute.mockReturnValue({
    params: { id: 'mock id'}
  });
  getOne.mockResolvedValueOnce({
    _id: 'mock id',
    title: 'mock title before',
    content: 'mock content before'
  });
  updateDoc.mockResolvedValueOnce();

  const wrapper = mount(UpdateDoc)
  await flushPromises();

  await wrapper.find('input[type="text"]').setValue('updated mock title');
  await wrapper.find('textarea').setValue('updated mock content');

  await wrapper.find('form').trigger('submit.prevent');
  await flushPromises();

  expect(updateDoc).toHaveBeenCalledWith({
    _id: 'mock id',
    title: 'updated mock title',
    content: 'updated mock content'
  });

  expect(wrapper.find('.updated').exists()).toBe(true);
});
