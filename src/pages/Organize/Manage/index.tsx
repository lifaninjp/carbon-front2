import { ModalForm, ProCard, ProColumns, ProForm, ProFormSelect, ProFormSwitch, ProFormText, ProTable } from "@ant-design/pro-components";
import industryAttributeInfoServices from '@/services/industry-attribute-infos';
import { Button } from "antd";
import { useState } from "react";

const { getIndustryAttributeInfos } = industryAttributeInfoServices.IndustryAttributeInfosController;

type TableListItem = {
  _id: string;
  company_nm?: string;
  specify_industry_nm?: string;
  fiscal_y?: string;
};

const OrganizeManagePage: React.FC = () => {
  const [dataSource, setDataSource] = useState<TableListItem[]>([]);
  const [dataCount, setDataCount] = useState<number>();

  const columns: ProColumns<TableListItem>[] = [
    { title: "企業名", dataIndex: "company_nm" },
    { title: "業界", dataIndex: "specify_industry_nm" },
    { title: "年度", dataIndex: "fiscal_y" },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <Button key="detail" >詳細</Button>
      ],
    }
  ];

  return (
    <ProCard.Group title={<h2>登録一覧</h2>}>
      <ProTable<TableListItem>
        bordered
        columns={columns}
        rowKey="_id"
        request={async (params, sorter, filter) => {
          const { current = 1, pageSize = 10, ...input } = params;
          const getRes = await getIndustryAttributeInfos({ page: current - 1, perPage: pageSize, ...input });
          setDataSource(getRes?.industryAttributeInfos || []);
          setDataCount(getRes?.totalCount);
          return Promise.resolve({
            data: dataSource,
            success: true,
          });
        }}
        dataSource={dataSource}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
          total: dataCount,
        }}
      />
    </ProCard.Group>
  );
};

export default OrganizeManagePage;