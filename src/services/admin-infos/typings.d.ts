declare namespace AdminInfosAPI {
  interface AdminInfo {
    _id?: string;
    manager_full_nm?: string;
    manager_cls?: number;
    mail_add?: string;
    tel_no?: string;
    company_nm?: string;
    valid_flg?: number;
    create_prg_id?: string;
    manager_id?: string;
    company_id?: string;
  }

  interface AdminInfos {
    totalCount?: number;
    adminInfos?: Array<Record<any>>;
  }

  interface AdminInfoToken {
    manager_full_nm?: string;
    valid_flg?: number;
    manager_id?: string;
    token?: string;
  }

  interface AdminInfoVerify {
    _id?: string;
    manager_id?: string;
    company_id?: string;
    valid_flg?: number;
    iat?: number;
    exp?: number;
  }

  interface SigninInput {
    manager_id?: string;
    mail_add?: string;
    password?: string;
  }

  interface UpdateInput {
    manager_full_nm?: string;
    company_nm?: string;
    tel_no?: string;
    valid_flg?: number;
  }

  interface ResetPasswordInput {
    manager_id?: string;
    old_password?: string;
    password?: string;
    password_confirm?: string;
  }

  interface FilterAdminInfoInput {
    manager_full_nm?: string;
    company_nm?: string;
    valid_flg?: number;
    page?: number;
    perPage?: number;
  }

  interface CreateAdminInfoInput {
    manager_full_nm?: string;
    company_nm?: string;
    mail_add?: string;
    tel_no?: string;
    manager_cls?: number;
    create_prg_id?: string;
    password: string;
  }
}