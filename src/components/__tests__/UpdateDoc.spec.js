import { test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import UpdateDoc from '../UpdateDoc.vue';
import { updateDoc } from '@/models/docs';

// mocking user input
vi.mock('@/models/docs', () => ({
  updateDoc: vi.fn()
}));


test('mock doc insertion', async () => {
  updateDoc.mockResolvedValueOnce('mock doc id');

  const wrapper = mount(UpdateDoc)
  expect(wrapper.exists()).toBe(true)
  await flushPromises();
});
