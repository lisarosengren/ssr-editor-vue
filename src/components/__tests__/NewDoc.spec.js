import { test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import NewDoc from '../NewDoc.vue';
import { newDoc } from '@/models/docs';

// mocking user input
vi.mock('@/models/docs', () => ({
  newDoc: vi.fn()
}));


test('mock doc insertion', async () => {
  newDoc.mockResolvedValueOnce('mock doc id');

  const wrapper = mount(NewDoc)
  expect(wrapper.exists()).toBe(true)
  await flushPromises();
});
