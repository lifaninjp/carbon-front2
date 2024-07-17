declare namespace IndustryAttributeInfosAPI {
  interface IndustryAttributeInfo {
    _id?: string;
    target_id?: string;
    company_id?: string;
    company_nm?: string;
    industry_attribute_id?: string;
    specify_industry_nm?: string;
    fiscal_y?: string;
    valid_flg?: number;
    create_prg_id?: string;
  }

  interface IndustryAttributeInfos {
    totalCount?: number;
    industryAttributeInfos?: Array<Record<IndustryAttributeInfo>>;
  }

  interface FilterAttributeInfosInput {
    company_nm?: string;
    specify_industry_nm?: string;
    page?: number;
    perPage?: number;
  }
}