/* eslint-disable no-undef */

import { test, describe, expect, vi } from "vitest";
import { updateDoc } from "@/models/docs";

describe('function updateDoc', () => {
    afterEach(() => {
    vi.restoreAllMocks();
});
    test('Test that no error is thrown when response is ok', async () =>{
        
        const docToUpdate = {
            _id: "68d0fb6182a1de187f427d65",
            title: "test title",
            content: "test content"
        }


        global.fetch = vi.fn().mockResolvedValue({
        ok: true
        });

        expect(updateDoc(docToUpdate)).resolves.toBeUndefined;
    });
    test('Test that error is thrown if response is not ok', async () =>{

        global.fetch = vi.fn().mockResolvedValue({
        ok: false
        });

        await expect(updateDoc()).rejects.toThrow('Database error')
    });
})