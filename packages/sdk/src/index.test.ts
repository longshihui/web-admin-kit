import { describe, expect, it, vi } from 'vitest'
import { createRequestUrl, createSdkClient, SdkResponseError } from './index'

describe('@lsh/sdk', () => {
  it('creates request urls with normalized base urls and query parameters', () => {
    expect(createRequestUrl('https://example.com/api', 'users', { page: 1, active: true })).toBe(
      'https://example.com/api/users?page=1&active=true'
    )
  })

  it('merges headers and parses json responses', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    )

    const client = createSdkClient({
      baseUrl: 'https://example.com/api',
      headers: {
        authorization: 'Bearer token'
      },
      fetch: fetchMock
    })

    await expect(client.request<{ ok: boolean }>('users')).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/api/users',
      expect.objectContaining({
        headers: expect.any(Headers)
      })
    )
  })

  it('throws typed response errors for failed responses', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 500 }))
    const client = createSdkClient({
      baseUrl: 'https://example.com/api',
      fetch: fetchMock
    })

    await expect(client.request('users')).rejects.toBeInstanceOf(SdkResponseError)
  })
})
