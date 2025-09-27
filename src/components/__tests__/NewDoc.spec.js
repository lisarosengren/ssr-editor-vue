import { test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import NewDoc from '../NewDoc.vue';
import { newDoc } from '@/models/docs';

// mocking user input
vi.mock('@/models/docs', () => ({
  newDoc: vi.fn()
}));

const mockPush = vi.fn();

test('mock successful doc insertion', async () => {
  newDoc.mockResolvedValueOnce('mock doc id');

  const wrapper = mount(NewDoc, {
    global: {
      mocks: {
        $router: {
          push: mockPush
        }
      }
    }
  });
  await wrapper.find('input[type="text"').setValue('mock insert title');
  await wrapper.find('textarea').setValue('mock insert content');
  await wrapper.find('form').trigger('submit');
  await flushPromises();
  expect(newDoc).toHaveBeenCalledWith({
    title: 'mock insert title',
    content: 'mock insert content'
  })

  expect(mockPush).toHaveBeenCalledWith('/mock doc id');
});

test('mock doc insertion failure', async () => {
  newDoc.mockRejectedValueOnce(new Error('Database error'));

  const wrapper = mount(NewDoc, {
    global: {
      mocks: {
        $router: {
          push: mockPush
        }
      }
    }
  });
  await wrapper.find('input[type="text"').setValue('mock insert title');
  await wrapper.find('textarea').setValue('mock insert content');
  await wrapper.find('form').trigger('submit');
  await flushPromises();
  expect(wrapper.find('.err').exists()).toBe(true);
  expect(newDoc).toHaveBeenCalled();
});
