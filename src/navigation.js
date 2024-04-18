import { getPermalink, /*getBlogPermalink, */ getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Pricing',
      href: '/pricing',
    },
    {
      text: 'Blog',
      href: '/blog',
    },
    {
      text: 'Request a Demo',
      href: '',
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '/features' },
        { text: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '/blog' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Linkedin', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/tanmayjuneja801/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
   All rights reserved by <a href="https://contravault.com/">ContraVault</a>
  `,
};

export function handleProductHover(productName) {
  let productLinks = [];
  switch (productName) {
    case 'SearChat':
      productLinks = headerData.links.find((link) => link.text === 'Products').links[0].links;
      break;
    case 'Chat Bot':
      productLinks = headerData.links.find((link) => link.text === 'Products').links[1].links;
      break;
    case 'Marketing Tools':
      // Currently there are no links for "Marketing Tools", you can add if needed
      productLinks = [];
      break;
    default:
      productLinks = [];
  }
  return productLinks;
}
