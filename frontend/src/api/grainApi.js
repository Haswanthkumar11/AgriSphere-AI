import client from './client';

/** Grade a grain sample image. Returns quality_score, metrics, recommended_floor_price. */
export const gradeGrain = (imageFile, farmerId = 'usr_demo') => {
  const fd = new FormData();
  fd.append('file', imageFile, 'grain.jpg');
  return client.post(`/api/v1/quality/grade?farmer_id=${farmerId}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
