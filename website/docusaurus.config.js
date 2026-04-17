// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ConiferFruits',
  tagline: 'ドキュメントサイト',
  favicon: 'img/favicon.ico',

  url: 'https://piggest.github.io',
  baseUrl: '/ConiferFruits/',

  organizationName: 'piggest',
  projectName: 'ConiferFruits',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  future: {
    faster: {
      rspackBundler: true,
      swcJsLoader: true,
    },
  },

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: ({docPath}) => `https://github.com/piggest/ConiferFruits/edit/main/docs/${docPath}`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        language: ['ja', 'en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsDir: '../docs',
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: false,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'ConiferFruits',
        items: [
          {
            href: 'https://github.com/piggest/ConiferFruits',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `© ${new Date().getFullYear()} ConiferFruits`,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
    }),
};

export default config;
