import { API_URL } from '@/constants';
import { request } from '@umijs/max';

const industryScopeMstsAPIPrefix = `${API_URL}/industry-scope-msts/`;

export async function getIndustryScopeMsts(
  params?: IndustryScopeMstsAPI.FilterScopeMstsInput,
  options?: { [key: string]: any },
) {
  return request<IndustryScopeMstsAPI.IndustryScopeMsts>(industryScopeMstsAPIPrefix, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getIndustryScopeMst(
  params: {
    industryScopeMstId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<IndustryScopeMstsAPI.IndustryScopeMst>(industryScopeMstsAPIPrefix + params?.industryScopeMstId, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createIndustryScopeMst(
  body?: IndustryScopeMstsAPI.CreateScopeMstInput,
  options?: { [key: string]: any },
) {
  return request<{ target_id: string }>(industryScopeMstsAPIPrefix, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteIndustryScopeMst(
  params: {
    industryScopeMstId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<number>(industryScopeMstsAPIPrefix + params?.industryScopeMstId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}