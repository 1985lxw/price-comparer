test('GET /api/search returns 400 if q missing', async () => {
  const res = await request(app).get('/api/search');
  expect(res.statusCode).toBe(400);
});