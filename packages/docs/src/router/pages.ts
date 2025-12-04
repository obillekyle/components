import { loadIcons } from '@iconify/vue'

export type Page = {
  name: string
  icon: string
  active?: string
  pages?: Record<string, Page>
}

const corePages: Record<string, Page> = {
  themeProvider: {
    name: 'Theme Provider',
    icon: 'material-symbols:palette-outline',
    active: 'material-symbols:palette'
  },
  layout: {
    name: 'Layout',
    icon: 'material-symbols:grid-view-outline',
    active: 'material-symbols:grid-view'
  },
  appBar: {
    name: 'AppBar',
    icon: 'material-symbols:toolbar-outline',
    active: 'material-symbols:toolbar'
  },
  box: {
    name: 'Box',
    icon: 'material-symbols:square-outline-rounded',
    active: 'material-symbols:square-rounded'
  },
  button: {
    name: 'Button',
    icon: 'material-symbols:buttons-alt-outline',
    active: 'material-symbols:buttons-alt'
  },
  card: {
    name: 'Card',
    icon: 'material-symbols:chrome-restore-outline',
    active: 'material-symbols:chrome-restore'
  },
  chip: {
    name: 'Chip',
    icon: 'material-symbols:label-outline',
    active: 'material-symbols:label'
  },
  divider: {
    name: 'Divider',
    icon: 'material-symbols:align-center'
  },
  form: {
    name: 'Form',
    icon: 'mdi:form-select'
  },
  frame: {
    name: 'Frame',
    icon: 'material-symbols:crop-free'
  },
  image: {
    name: 'Image',
    icon: 'material-symbols:image-outline',
    active: 'material-symbols:image'
  },
  input: {
    name: 'Input',
    icon: 'mdi:form-textbox'
  },
  list: {
    name: 'List',
    icon: 'material-symbols:list'
  },
  modal: {
    name: 'Modal',
    icon: 'material-symbols:video-label'
  },
  navigation: {
    name: 'Navigation',
    icon: 'material-symbols:navigation-outline',
    active: 'material-symbols:navigation'
  },
  paper: {
    name: 'Paper',
    icon: 'material-symbols:layers-outline',
    active: 'material-symbols:layers'
  },
  progress: {
    name: 'Progress',
    icon: 'material-symbols:sliders'
  },
  select: {
    name: 'Select',
    icon: 'material-symbols:check-box-outline',
    active: 'material-symbols:check-box'
  },
  sheet: {
    name: 'Sheet',
    icon: 'material-symbols:vertical-align-bottom'
  },
  skeleton: {
    name: 'Skeleton',
    icon: 'material-symbols:blur-on'
  },
  slider: {
    name: 'Slider',
    icon: 'mdi:slider'
  },
  snackbar: {
    name: 'Snackbar',
    icon: 'material-symbols:branding-watermark-outline',
    active: 'material-symbols:branding-watermark'
  },
  switch: {
    name: 'Switch',
    icon: 'material-symbols:toggle-on-outline',
    active: 'material-symbols:toggle-on'
  },
  toast: {
    name: 'Toast',
    icon: 'material-symbols:notifications-outline',
    active: 'material-symbols:notifications'
  }
}

const docsPages: Record<string, Page> = {
  gettingStarted: {
    name: 'Getting Started',
    icon: 'mdi:book-open-outline',
    active: 'mdi:book-open'
  }
}

const utilsPages: Record<string, Page> = {
  colors: {
    name: 'Colors',
    icon: 'material-symbols:colors'
  },
  colorEngine: {
    name: 'Color Engine',
    icon: 'mdi:palette-outline',
    active: 'mdi:palette'
  },
  componentManager: {
    name: 'Component Manager',
    icon: 'material-symbols:settings-applications-outline',
    active: 'material-symbols:settings-applications'
  },
  createStyle: {
    name: 'Create Style',
    icon: 'material-symbols:style-outline',
    active: 'material-symbols:style'
  },
  css: {
    name: 'CSS',
    icon: 'ion:logo-css3'
  },
  dom: {
    name: 'DOM',
    icon: 'material-symbols:web'
  },
  event: {
    name: 'Event',
    icon: 'material-symbols:touch-app-outline',
    active: 'material-symbols:touch-app'
  },
  function: {
    name: 'Function',
    icon: 'material-symbols:functions'
  },
  idb: {
    name: 'IDB Storage',
    icon: 'material-symbols:storage'
  },
  number: {
    name: 'Number',
    icon: 'mdi:numeric'
  },
  object: {
    name: 'Object',
    icon: 'material-symbols:account-tree-outline',
    active: 'material-symbols:account-tree'
  },
  other: {
    name: 'Other',
    icon: 'material-symbols:more-horiz'
  },
  ref: {
    name: 'Ref',
    icon: 'material-symbols:auto-fix-outline',
    active: 'material-symbols:auto-fix'
  },
  string: {
    name: 'String',
    icon: 'mdi:format-text-variant-outline',
    active: 'mdi:format-text-variant'
  }
}

const pages: Record<string, Page> = {
  home: {
    name: 'Home',
    icon: 'material-symbols:home-outline',
    active: 'material-symbols:home'
  },
  docs: {
    name: 'Docs',
    icon: 'material-symbols:book-outline',
    active: 'material-symbols:book',
    pages: docsPages
  },
  core: {
    name: 'Core',
    icon: 'mdi:shape-outline',
    active: 'mdi:shape',
    pages: corePages
  },
  utils: {
    name: 'Utils',
    icon: 'mdi:pencil-ruler-outline',
    active: 'mdi:pencil-ruler',
    pages: utilsPages
  },
  search: {
    name: 'Search',
    icon: 'material-symbols:search'
  }
}

function preloadIcons(pages: Record<string, Page>) {
  setTimeout(() => {
    const icons: string[] = []
    for (const page of Object.values(pages)) {
      if (page.icon) {
        icons.push(page.icon)
      }
      if (page.active) {
        icons.push(page.active)
      }
      if (page.pages) {
        preloadIcons(page.pages)
      }
    }

    loadIcons(icons)
  })
}

preloadIcons(pages)

export default pages
