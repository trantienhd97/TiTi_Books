// Docusaurus configuration for Supa docs
module.exports = {
  title: 'Supa Docs',
  tagline: 'Documentation for Supa mobile modules',
  url: 'https://example.com',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'your-org',
  projectName: 'supa-docs',
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-org/your-repo/edit/main/docs-site/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  themeConfig: {
    navbar: {
      title: 'Supa',
      logo: {
        alt: 'Supa Logo',
        src: 'img/logo.svg'
      },
      items: [
        { to: 'docs/', label: 'Docs', position: 'left' }
      ]
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© ${new Date().getFullYear()} Supa`
    }
  }
};
