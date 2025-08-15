import "/style.css";

const { h } = window;

CMS.registerPreviewStyle('/style.css');

const PagesPreview = ({ entry, widgetFor }) => {
  const title = entry.getIn(['data', 'title']);
  const bodyClass = entry.getIn(['data', 'bodyClass']) || '';

  return h('div', { className: bodyClass }, [
    h('div', { id: 'overlay' }),
    h('div', { className: 'topbar' }, [
      h('button', { className: 'hamburger', type: 'button', 'aria-label': 'Open menu' }, '\u2630'),
      h('div', { className: 'logo' }, h('a', { href: '/index.html' }, 'MU'))
    ]),
    h('nav', { id: 'mobileMenu', className: 'slideout' }, [
      h('button', { className: 'close-btn', type: 'button', 'aria-label': 'Close menu' }, '\u00d7'),
      h('ul', null, [
        h('li', null, h('a', { href: '/index.html' }, 'About')),
        h('li', { className: 'portfolio-toggle' }, [
          h('a', { href: '#' }, ['Portfolio ', h('span', { className: 'arrow' }, '\u25BE')]),
          h('ul', { className: 'portfolio-sub' }, [
            h('li', null, h('a', { href: '/brand-identity.html' }, '\u2022 Brand Identity')),
            h('li', null, h('a', { href: '/graphic-design.html' }, '\u2022 Graphic Design')),
            h('li', null, h('a', { href: '/illustration.html' }, '\u2022 Illustration')),
            h('li', null, h('a', { href: '/packaging-design.html' }, '\u2022 Packaging')),
            h('li', null, h('a', { href: '/stylist.html' }, '\u2022 Stylist')),
            h('li', null, h('a', { href: '/textile-design.html' }, '\u2022 Textile'))
          ])
        ]),
        h('li', null, h('a', { href: '/features.html' }, 'Features')),
        h('li', null, h('a', { href: '/cv.html', className: 'cv-label' }, 'CV'))
      ])
    ]),
    h('main', null, [
      title && h('h1', null, title),
      widgetFor('body')
    ]),
    h('footer', { className: 'social-footer' }, [
      h('a', { href: 'https://www.instagram.com/mariameraai/', target: '_blank', rel: 'noopener noreferrer' },
        h('img', { src: '/instagram-logo.svg', alt: 'Instagram' })
      ),
      h('p', { className: 'credit' }, 'built by CheekyBuild'),
      h('a', { href: '/admin/', className: 'visually-hidden' }, 'Admin')
    ])
  ]);
};

CMS.registerPreviewTemplate('pages', PagesPreview);
