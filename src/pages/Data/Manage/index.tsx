import { waitTime } from '@/utils/common';
import type { ProColumns } from '@ant-design/pro-components';
import { ProFormGroup, ProFormSelect, ProTable } from '@ant-design/pro-components';
import scopeDataServices from '@/services/scope-datas';
import { useRequest } from 'ahooks';
import { useState } from 'react';

const { getScopeDatas, getScopeData } = scopeDataServices.ScopeDatasController;

type ScopeListItem = {
  _id: string;
  scope_id?: string;
  sub_scope_id?: string;
  sub_scope_name?: string;
}

type TypeListItem = {
  id: string;
  scope_and_category: string;
  name: string;
  unit: string;
  emission_value: number;
};

const columns: ProColumns<TypeListItem>[] = [
  {
    title: 'SCOPE・カテゴリ',
    dataIndex: 'scope_and_category',
    search: false
  },
  {
    title: '種類',
    dataIndex: 'name',
  },
  {
    title: 'emission_value',
    dataIndex: 'emission_value',
    search: false
  },
  {
    title: 'unit',
    dataIndex: 'unit',
    search: false
  }
];

const DataManagePage: React.FC = () => {
  const [scope, setScope] = useState<ScopeListItem>();
  const [nameFilter, setNameFilter] = useState<string>("");

  const scopeDatasRes = useRequest(async () => await getScopeDatas({ year: "2022" }),
    {
      ready: !scope,
      onSuccess: (data) => {
        setScope(data?.scopeDatas?.[0]);
      }
    });

  const currentTypeListRes = useRequest(async () => {
    const { type_lists } = await getScopeData({ scopeDataId: scope?._id });
    await waitTime(290);
    return type_lists;
  }, { ready: !!scope, refreshDeps: [scope] })

  const loadingRes = useRequest(async (props?) => {
    await waitTime(300)
    setNameFilter(props?.name);
    return Promise.resolve({})
  });

  const dataSource = currentTypeListRes?.data
    ?.filter((item: TypeListItem) => !nameFilter || item.name.includes(nameFilter))
    ?.map((item: TypeListItem) => (
      { ...item, scope_and_category: `${scope?.scope_id}・${scope?.sub_scope_name}` }
    ))

  return (
    <div
      style={{
        backgroundColor: '#eee',
        padding: 20,
      }}
    >
      <ProFormGroup size={"small"}>
        <ProFormSelect
          width="md"
          name="scopeId"
          label="Scope·カテゴリ"
          options={scopeDatasRes?.data?.scopeDatas?.map((item: ScopeListItem) => ({ label: `${item.scope_id}${item.sub_scope_name && "・" + item.sub_scope_name}`, value: item._id }))}
          fieldProps={{
            value: scope?._id,
            style: { width: "200px" },
            onChange: (value) => setScope(scopeDatasRes?.data?.scopeDatas?.find((item: ScopeListItem) => item._id === value)),
          }}
        />
      </ProFormGroup>
      <ProTable<TypeListItem>
        columns={columns}
        rowKey="id"
        loading={loadingRes.loading || currentTypeListRes.loading}
        search={{
          labelWidth: 'auto',
          collapsed: false,
          collapseRender: false,
        }}
        onSubmit={loadingRes.run}
        onReset={loadingRes.run}
        pagination={{
          defaultPageSize: 10,
          onChange: (page) => loadingRes.refresh(),
        }}
        headerTitle="SCOPEデータ"
        dataSource={dataSource}
      />
    </div>
  );
};
export default DataManagePage;