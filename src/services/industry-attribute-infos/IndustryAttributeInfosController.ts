import { API_URL } from '@/constants';
import { request } from '@umijs/max';

const industryAttributeInfosAPIPrefix = `${API_URL}/industry-attribute-infos/`;

export async function getIndustryAttributeInfos(
  params?: IndustryAttributeInfosAPI.FilterAttributeInfosInput,
  options?: { [key: string]: any },
) {
  return request<IndustryAttributeInfosAPI.IndustryAttributeInfos>(industryAttributeInfosAPIPrefix, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getIndustryAttributeInfo(
  params: {
    industryAttributeInfoId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<IndustryAttributeInfosAPI.IndustryAttributeInfo>(industryAttributeInfosAPIPrefix + params?.industryAttributeInfoId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}