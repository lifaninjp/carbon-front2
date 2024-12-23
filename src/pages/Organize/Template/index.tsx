import { ModalForm, ProForm, ProFormGroup, ProFormRadio, ProFormSelect, ProFormText, ProList } from '@ant-design/pro-components';
import { Button, Form, Segmented, Space, Tag, Typography, message } from 'antd';
import { useState } from 'react';
import industryScopeMstServices from '@/services/industry-scope-msts';
import industryAttributeMstServices from '@/services/industry-attribute-msts';
import scopeDataServices from '@/services/scope-datas';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { waitTime } from '@/pages/User/Manage';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';

const { Text, Title } = Typography;

const { getIndustryScopeMsts, createIndustryScopeMst, deleteIndustryScopeMst } = industryScopeMstServices.IndustryAttributeInfosController;
const { getScopeDatas } = scopeDataServices.ScopeDatasController;
const {
  getIndustryAttributeMsts,
  createIndustryAttributeMst,
  updateIndustryAttributeMst
} = industryAttributeMstServices.IndustryAttributeMstsController;

type TableListItem = {
  _id?: string;
  scope_cls?: string;
  category_cls?: string;
  category_nm?: string;
  category?: string;
  title?: string;
  department?: string;
  active_data?: string;
};

type ScopeSelectItem = {
  _id: string;
  scope_id?: string;
  sub_scope_id?: string;
  sub_scope_name?: string;
  category?: string;
  title?: string;
  department?: string;
  active_data?: string;
  year?: string;
};

const OrganizeTemplatePage: React.FC = () => {
  const { adminInfo } = useModel('global');
  const [scopeCatogry, setScopeCatogry] = useState<string>("upplevel");
  const [templateId, setTemplateId] = useState<string>("");

  // Request 業界テンプレート
  const industryAttributeMstsRes = useRequest(async (args) =>
    await getIndustryAttributeMsts({ valid_flg: 1, perPage: 999 })
    , {
      onSuccess: (data, args) => {
        if (args?.[0]?.modalType === "add") {
          setTemplateId(data?.industryAttributeMsts[data?.industryAttributeMsts?.length - 1].industry_attribute_id);
        } else if (args?.[0]?.modalType === "edit") {
          return;
        } else {
          setTemplateId(data?.industryAttributeMsts[0].industry_attribute_id);
        }

      }
    }
  )

  // Request Scope list Data
  const scopeMstsRes = useRequest(async () => {
    const res = await getIndustryScopeMsts({ industry_attribute_id: templateId });
    return {
      total: res.totalCount,
      list: res?.industryScopeMsts?.filter(item => item.category === scopeCatogry)
    }
  }, { refreshDeps: [templateId, scopeCatogry], ready: !!templateId })

  const scopeMstlistData: any = scopeMstsRes?.data?.list?.map((item: TableListItem) => ({
    title: item.title,
    subTitle: <Space><Tag color="#5BD8A6">{item.scope_cls}</Tag><Tag hidden={!item.category_nm}>{item.category_nm}</Tag></Space>,
    actions: [<DeleteScopeModal industryScopeMstId={item._id} scopeMstsRes={scopeMstsRes} />],
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <Space direction="vertical" style={{ marginTop: "-10px", marginBlockEnd: "-30px", minHeight: "200px" }}>
        <Text style={{ fontSize: "12px" }}>想定関連部署： {item.department}</Text>
        <Text style={{ fontSize: "12px" }}>活動量データ： {item.active_data}</Text>
        {/* <img
          width={180}
          style={{ marginBlockStart: "20px" }}
          src="http://management.cc-dashboards.com/scopes/SCOPE3CAT01.svg"
        /> */}
      </Space>
    ),
  }));

  // Request ScopeData
  const scopeDataRes = useRequest(async () =>
    await getScopeDatas({ category: scopeCatogry, year: "2022", perPage: 999 })
    , { refreshDeps: [scopeCatogry], ready: !!templateId })

  // Filter Scope Select Data
  const diffScopeData = [];
  for (const scopeData of scopeDataRes?.data?.scopeDatas || []) {
    if (!scopeMstsRes?.data?.list.find((item: any) => item.scope_cls === scopeData.scope_id && item.category_cls === scopeData.sub_scope_id)) {
      diffScopeData.push(scopeData)
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#eee',
        // margin: -24,
        padding: 40,
      }}
    >
      <ProFormGroup size={"small"}>
        <ProFormSelect
          width="md"
          name="industry_attribute_id"
          label="業界テンプレート："
          options={industryAttributeMstsRes.data?.industryAttributeMsts.map((item: any) => ({ label: item.industry_cls_nm, value: item.industry_attribute_id }))}
          // initialValue={templateId}
          fieldProps={{
            // TOASK
            value: templateId,
            style: { width: "200px" },
            onChange: setTemplateId,
          }}
        />
        <CreatModal adminInfo={adminInfo} industryAttributeMstsRes={industryAttributeMstsRes} />
        <UpdateModal templateId={templateId} industryAttributeMstsRes={industryAttributeMstsRes} />
        <DeleteModal templateId={templateId} industryAttributeMstsRes={industryAttributeMstsRes} />
      </ProFormGroup>

      <Segmented
        options={[
          {
            label: (
              <div style={{ padding: 4 }}>
                <Text style={{ fontSize: "20px" }} type='secondary'>上流</Text>
              </div>
            ),
            value: 'upplevel',
          },
          {
            label: (
              <div style={{ padding: 4 }}>
                <Text style={{ fontSize: "20px" }} type='secondary'>生産</Text>
              </div>
            ),
            value: 'product',
          },
          {
            label: (
              <div style={{ padding: 4 }}>
                <Text style={{ fontSize: "20px" }} type='secondary'>下流</Text>
              </div>
            ),
            value: 'downlevel',
          }
        ]}
        block
        style={{ height: "50px", marginBottom: "10px" }}
        onChange={setScopeCatogry}
      ></Segmented>
      <ProFormGroup size={"small"}>
        <CreatScopeModal diffScopeData={diffScopeData} adminInfo={adminInfo} templateId={templateId} scopeMstsRes={scopeMstsRes} />
      </ProFormGroup>
      <ProList<any>
        ghost
        grid={{ gutter: 10, column: 3 }}
        metas={{
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: { cardActionProps: "actions" },
        }}
        dataSource={scopeMstlistData}
      // headerTitle="Scopeリスト"
      />
    </div>
  )
};

const CreatModal: React.FC<{ adminInfo: AdminInfosAPI.AdminInfoVerify, industryAttributeMstsRes: any }> = ({ adminInfo, industryAttributeMstsRes }) => {
  const [form] = Form.useForm<{
    industry_cls_nm: string;
  }>();
  return (
    <ModalForm<{
      industry_cls_nm: string;
    }>
      title="テンプレートを追加する"
      trigger={
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
        >
          テンプレートを追加
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        cancelText: "キャンセル",
        okText: "完了"
      }}
      submitTimeout={1000}
      onFinish={async (values) => {
        await waitTime(1000);
        const createRes = await createIndustryAttributeMst({ create_prg_id: adminInfo.manager_id, ...values });
        if (createRes._id) {
          message.success("追加成功");
          industryAttributeMstsRes.run({ modalType: "add" });
        }
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="industry_cls_nm"
          label="業界名"
          rules={[{ required: true, message: '必須', }]}
        />
      </ProForm.Group>
    </ModalForm>
  );
}

const UpdateModal: React.FC<{ templateId: string, industryAttributeMstsRes: any }> = ({ templateId, industryAttributeMstsRes }) => {
  const [form] = Form.useForm<{
    industry_cls_nm: string;
  }>();
  return (
    <ModalForm<{
      industry_cls_nm: string;
    }>
      title="テンプレートを編集する"
      trigger={
        <Button
          key="button"
          icon={<EditOutlined />}
          type="default"
        >
          編集
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        cancelText: "キャンセル",
        okText: "完了"
      }}
      submitTimeout={1000}
      onFinish={async (values) => {
        await waitTime(1000);
        await updateIndustryAttributeMst({ industry_attribute_id: templateId }, values);
        message.success("更新成功");
        industryAttributeMstsRes.run({ modalType: "edit" });
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="industry_cls_nm"
          label="業界名"
          rules={[{ required: true, message: '必須', }]}
          initialValue={industryAttributeMstsRes?.data?.industryAttributeMsts?.find((item: any) => item?.industry_attribute_id === templateId)?.industry_cls_nm}
        />
      </ProForm.Group>
    </ModalForm>
  );
}

const DeleteModal: React.FC<{ templateId: string, industryAttributeMstsRes: any }> = ({ templateId, industryAttributeMstsRes }) => {
  const [form] = Form.useForm<{
    rowKey: string;
  }>();
  return (
    <ModalForm<{
      rowKey: string;
    }>
      title={<Title level={4}>このアイテムを削除しますか？</Title>}
      trigger={
        <Button
          icon={<DeleteOutlined />}
          type="default"
        >
          削除
        </Button>
      }
      form={form}
      modalProps={{
        destroyOnClose: true,
        centered: true,
        confirmLoading: true,
        cancelText: "キャンセル",
        okText: "確定"
      }}
      onFinish={async () => {
        await waitTime(1000);
        await updateIndustryAttributeMst({ industry_attribute_id: templateId }, { valid_flg: 0 });
        message.success("更新成功");
        industryAttributeMstsRes.run({ modalType: "delete" });
        return true;
      }}
    >
    </ModalForm>
  )
}

const CreatScopeModal: React.FC<{ templateId: string, diffScopeData: any, adminInfo: AdminInfosAPI.AdminInfoVerify, scopeMstsRes: any }> =
  ({ templateId, diffScopeData, adminInfo, scopeMstsRes }) => {
    const [form] = Form.useForm<{
      scopeDataId: string;
    }>();
    return (
      <ModalForm<{
        scopeDataId: string;
      }>
        title="Scopeを追加する"
        trigger={
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            Scopeを追加
          </Button>
        }
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          cancelText: "キャンセル",
          okText: "完了"
        }}
        submitTimeout={1000}
        onFinish={async (values) => {
          const currentScope: ScopeSelectItem = diffScopeData.find((item: ScopeSelectItem) => item._id === values.scopeDataId);
          await waitTime(1000);
          const createRes = await createIndustryScopeMst({
            create_prg_id: adminInfo.manager_id,
            industry_attribute_id: templateId,
            scope_cls: currentScope.scope_id,
            category_cls: currentScope.sub_scope_id,
            year: currentScope.year
          });
          if (createRes.target_id) {
            message.success("追加成功");
            scopeMstsRes.refresh();
          }
          return true;
        }}
      >
        <ProForm.Group>
          <ProFormSelect
            width="md"
            name="scopeDataId"
            label="カテゴリ"
            options={diffScopeData?.map((item: any) => (
              { value: item._id, label: `${item.scope_id}・${item.sub_scope_name}(${item.title})` }
            ))}
            rules={[{ required: true, message: '必須' }]}
          />
        </ProForm.Group>
      </ModalForm>
    );
  }

const DeleteScopeModal: React.FC<{ industryScopeMstId: any, scopeMstsRes: any }> = ({ industryScopeMstId, scopeMstsRes }) => {
  const [form] = Form.useForm<{
    industryScopeMstId: string;
  }>();
  return (
    <ModalForm<{
      industryScopeMstId: string;
    }>
      title={<Title level={4}>このアイテムを削除しますか？</Title>}
      trigger={
        <a>削除</a>
      }
      form={form}
      modalProps={{
        destroyOnClose: true,
        centered: true,
        confirmLoading: true,
        cancelText: "キャンセル",
        okText: "確定"
      }}
      onFinish={async () => {
        await waitTime(1000);
        await deleteIndustryScopeMst({ industryScopeMstId });
        message.success("削除完了");
        scopeMstsRes.refresh();
        return true;
      }}
    >
    </ModalForm>
  )
}
export default OrganizeTemplatePage;