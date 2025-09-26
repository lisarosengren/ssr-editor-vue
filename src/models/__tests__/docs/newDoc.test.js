/* eslint-disable no-undef */

import { test, describe, expect, vi } from "vitest";
import { newDoc } from "@/models/docs";

describe('function newDoc', () => {
    afterEach(() => {
    vi.restoreAllMocks();
});
    test('Test the function when response is ok', async () =>{
        const mockResponse = {
            "acknowledged": true,
            "insertedId": "68d680f5e00b06809e15130f"
        };

        global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse)
        });

        const res = await newDoc();
                
        expect(res).toEqual(mockResponse.insertedId);
    });
    test('Test the function when response is not ok', async () =>{

        global.fetch = vi.fn().mockResolvedValue({
        ok: false
        });

        await expect(newDoc()).rejects.toThrow('Database error')
    });
})