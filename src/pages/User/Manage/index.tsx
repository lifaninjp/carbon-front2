import { ModalForm, ProCard, ProColumns, ProForm, ProFormSelect, ProFormSwitch, ProFormText, ProTable } from "@ant-design/pro-components";
import adminInfoServices from '@/services/admin-infos';
import { useState } from "react";
import { Button, Form, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const { getAdminInfos, createAdminInfo, updateAdminInfo } = adminInfoServices.AdminInfosController;

type TableListItem = {
  _id: string;
  manager_id?: string;
  manager_full_nm?: string;
  manager_cls?: number;
  mail_add?: string;
  tel_no?: string;
  company_nm?: string;
  valid_flg?: number;
};

const UserManagePage: React.FC = () => {
  const [dataSource, setDataSource] = useState<TableListItem[]>([]);
  const [dataCount, setDataCount] = useState<number>();
  const { adminInfo } = useModel('global')


  const columns: ProColumns<TableListItem>[] = [
    {
      title: "ステータス",
      dataIndex: "valid_flg",
      renderText: (text, record, index) => <Tag color={text ? "success" : "warning"}>{text ? "使用中" : "停止中"}</Tag>,
      valueType: "select",
      valueEnum: {
        0: { text: "停止中" },
        1: { text: "使用中" },
      }
    },
    {
      title: "種類",
      dataIndex: "manager_cls",
      valueType: "select",
      valueEnum: {
        1: { text: "管理者" },
        2: { text: "利用者" },
      }
    },
    { title: "ID", dataIndex: "manager_id" },
    { title: "担当者氏名", dataIndex: "manager_full_nm" },
    { title: "企業名", dataIndex: "company_nm" },
    { title: "電話番号", dataIndex: "tel_no" },
    { title: "メール", dataIndex: "mail_add" },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <EditModal record={record} setDataSource={setDataSource} key="edit" />
      ],
    }
  ];

  return (
    <ProCard.Group title={<h2>ユーザー管理</h2>}>
      <ProTable<TableListItem>
        bordered
        columns={columns}
        rowKey="_id"
        request={async (params, sorter, filter) => {
          const { current = 1, pageSize = 10, ...input } = params;
          const getRes = await getAdminInfos({ page: current - 1, perPage: pageSize, ...input });
          setDataSource(getRes?.adminInfos || []);
          setDataCount(getRes?.totalCount);
          return Promise.resolve({
            data: dataSource,
            success: true,
          });
        }}
        dataSource={dataSource}
        // onChange={setDataSource}
        search={{
          layout: 'vertical',
          defaultCollapsed: false,
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <CreatModal setDataSource={setDataSource} adminInfo={adminInfo} />
        ]}
        pagination={{
          pageSize: 10,
          total: dataCount,
        }}
      />
    </ProCard.Group>
  );
};

const CreatModal: React.FC<{ setDataSource: any, adminInfo: AdminInfosAPI.AdminInfoVerify }> = ({ setDataSource, adminInfo }) => {
  const [form] = Form.useForm<{
    company_nm: string;
    manager_full_nm: string;
    tel_no: string;
    manager_cls: number;
    mail_add: string;
    password: string;
    confirmPassword: string;
  }>();
  return (
    <ModalForm<{
      company_nm: string;
      manager_full_nm: string;
      tel_no: string;
      manager_cls: number;
      mail_add: string;
      password: string;
      confirmPassword: string;
    }>
      title="ユーザー追加"
      trigger={
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
        >
          追加
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
        const { confirmPassword, ...input } = values;
        await waitTime(1000);
        const createRes = await createAdminInfo({ create_prg_id: adminInfo.manager_id, ...input });
        if (createRes._id) {
          message.success("追加成功");
          const fetchRes = await getAdminInfos({ page: 0, perPage: 10 });
          if (fetchRes) setDataSource(fetchRes.adminInfos);
        }
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="company_nm"
          label="企業名"
          rules={[{ required: true, message: '必須', }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="manager_full_nm"
          label="担当者氏名"
          rules={[{ required: true, message: '必須', }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="tel_no"
          label="電話番号"
          rules={[{ required: true, message: '必須' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="manager_cls"
          label="種類"
          options={[
            {
              value: 1,
              label: "管理者",
            },
            {
              value: 2,
              label: "利用者",
            }
          ]}
          rules={[{ required: true, message: '必須', }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="mail_add"
          label="Email"
          rules={[{ required: true, message: '必須' }, { type: "email" }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="password"
          label="パスワード"
          rules={[{ required: true, message: '必須', }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="confirmPassword"
          label="パスワード確認"
          rules={[
            {
              required: true,
              message: '必須',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('パスワードと一致しない'));
              },
            }),
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
}

const EditModal: React.FC<{ record: TableListItem, setDataSource: any }> = ({ record, setDataSource }) => {
  const [form] = Form.useForm<{
    manager_full_nm: string;
    company_nm: string;
    tel_no: string;
    valid_flg: number;
  }>();
  return (
    <ModalForm<{
      manager_full_nm: string;
      company_nm: string;
      tel_no: string;
    }>
      title="ユーザー編集"
      trigger={
        <a>
          編集
        </a>
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
        const res = await updateAdminInfo({ adminInfoId: record._id }, values);
        if (res.message === '更新成功') {
          message.success(res.message);
          const fetchRes = await getAdminInfos({ page: 0, perPage: 10 });
          if (fetchRes) setDataSource(fetchRes.adminInfos);
        } else if (res.message === '更新失败') {
          message.error(res.message);
        }
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="manager_full_nm"
          label="氏名"
          initialValue={record.manager_full_nm}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="company_nm"
          label="企業名"
          initialValue={record.company_nm}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="tel_no"
          label="電話番号"
          initialValue={record.tel_no}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSwitch
          width="md"
          name="valid_flg"
          label="アカウント状態"
          initialValue={record.valid_flg}
          checkedChildren="使用中"
          unCheckedChildren="停止中"
          transform={(value) => value ? 1 : 0}
        />
      </ProForm.Group>
    </ModalForm>
  );
}

export default UserManagePage;