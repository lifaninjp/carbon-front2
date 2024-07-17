declare namespace IndustryScopeMstsAPI {
  interface IndustryScopeMst {
    _id: string;
    target_id: string;
    scope_cls: string;
    category_cls: string;
    category_nm: string;
    category: string;
    title: string;
    department: string;
    active_data: string;
  }

  interface IndustryScopeMsts {
    totalCount: number;
    industryScopeMsts: Array<Record<IndustryScopeMst>>;
  }

  interface FilterScopeMstsInput {
    industry_attribute_id?: string;
    page?: number;
    perPage?: number;
  }

  interface CreateScopeMstInput {
    industry_attribute_id?: string;
    scope_cls?: string;
    category_cls?: string;
    year?: string;
    create_prg_id?: string;
  }
}
