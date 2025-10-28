/* eslint-disable no-undef */

// import { test, describe, expect, vi } from "vitest";
// import { getAll } from "@/models/docs";

// describe('function getAll', () => {
//     afterEach(() => {
//     vi.restoreAllMocks();
// });
//     test('Test the function when response is ok', async () =>{
//         const mockResponse = [
//         { "_id": "68d0fb6182a1de187f427d65",
//         "title": "Test title",
//         "content": "Test content" }
//         ];

//         global.fetch = vi.fn().mockResolvedValue({
//         ok: true,
//         json: vi.fn().mockResolvedValue(mockResponse)
//         });

//         const res = await getAll();
                
//         expect(res).toEqual(mockResponse);
//     });
//     test('Test the function when response is not ok', async () =>{

//         global.fetch = vi.fn().mockResolvedValue({
//         ok: false
//         });

//         await expect(getAll()).rejects.toThrow('Database error')
//     });
// })