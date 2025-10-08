import { test, expect, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import NewDoc from '../NewDoc.vue';
import { newDoc } from '@/models/docs';

// mocking user input
vi.mock('@/models/docs', () => ({
  newDoc: vi.fn()
}));

const mockPush = vi.fn();

function setUpTest() {
  const wrapper = mount(NewDoc, {
    global: {
      mocks: {
        $router: {
          push: mockPush
        }
      }
    }
  });

  return wrapper;
}

async function formData(wrapper, title, type) {
  await wrapper.find('input[type="text"]').setValue(title);
  await wrapper.find('input[type="radio"]').setValue(type)
  await wrapper.find('form').trigger('submit');
  await flushPromises();
}

test('mock successful doc insertion', async () => {
  newDoc.mockResolvedValueOnce('mock doc id');

  const wrapper = setUpTest();

  await formData(wrapper, 'mock insert title', 'code');

  expect(newDoc).toHaveBeenCalledWith({
    title: 'mock insert title',
    type: 'code'
  })

  expect(mockPush).toHaveBeenCalledWith('/mock doc id/code');
});

test('mock doc insertion failure', async () => {
  newDoc.mockRejectedValueOnce(new Error('Database error'));

  const wrapper = setUpTest();

  await formData(wrapper, 'mock insert title', 'code');

  expect(wrapper.find('.err').exists()).toBe(true);
  expect(newDoc).toHaveBeenCalled();
});
