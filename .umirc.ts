import { defineConfig } from '@umijs/max';
import jaJP from 'antd/locale/ja_JP';

export default defineConfig({
  antd: {
    // configProvider
    configProvider: {
      locale: jaJP
    },
    // themes
    dark: false,
    compact: false,
    // less or css, default less
    style: 'less',
    // shortcut of `configProvider.theme`
    // use to configure theme token, antd v5 only
    theme: {
      components: {
        Segmented: {
          // itemActiveBg: "#499A6D",
          // itemSelectedBg: "#499A6D",
          // itemSelectedColor: "#FFFFFF"
        },
      },

    },
    // antd <App /> valid for version 5.1.0 or higher, default: undefined
    appConfig: {},
    // Transform DayJS to MomentJS
    momentPicker: true,
    // Add StyleProvider for legacy browsers
    styleProvider: {
      hashPriority: 'high',
      legacyTransformer: true,
    },
  },
  access: {},
  model: {},
  initialState: {},
  define: { 'process.env.API_URL': 'http://35.72.154.8:4000' },
  request: {},
  layout: {},
  routes: [
    {
      path: '/',
      redirect: '/user/manage',
    },
    {
      path: '/login',
      component: './Login',
    },
    {
      path: '/profile',
      component: './Profile',
    },
    {
      name: 'ユーザー',
      path: '/user',
      routes: [
        {
          name: 'ユーザー管理',
          path: '/user/manage',
          component: './User/Manage',
        }
      ]
    },
    {
      name: 'データ管理',
      path: '/data',
      routes: [
        {
          name: '管理',
          path: '/data/manage',
          component: './Data/Manage',
        }
      ]
    },
    {
      name: '業種レコメンド',
      path: '/organize',
      routes: [
        {
          name: '登録一覧',
          path: '/organize/manage',
          component: './Organize/Manage',
        },
        {
          name: 'テンプレート',
          path: '/organize/template',
          component: './Organize/Template',
        }
      ]
    },
  ],
  npmClient: 'yarn',
});

