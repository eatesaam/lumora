import apiClient, { apiClient as named, api, getErrorMessage } from '../api/client';

describe('api client', () => {
  it('exports same instance as default and named with empty baseURL', () => {
    expect(apiClient).toBe(named);
    expect(apiClient.defaults.baseURL).toBe('');
  });

  it('getShowreel returns data using contract keys', async () => {
    const spy = jest.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { id: 1, title: 'Reel', videoUrl: 'https://x/v.mp4', posterUrl: null },
    } as any);
    const r = await api.getShowreel();
    expect(spy).toHaveBeenCalledWith('/api/showreel');
    expect(r.title).toBe('Reel');
  });

  it('getErrorMessage extracts server error or falls back', () => {
    expect(getErrorMessage({ response: { data: { error: 'Bad' } } })).toBe('Bad');
    expect(getErrorMessage({}, 'fallback')).toBe('fallback');
  });
});