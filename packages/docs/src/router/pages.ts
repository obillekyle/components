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
  list: {
    name: 'List',
    icon: 'material-symbols:list'
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
  progress: {
    name: 'Progress',
    icon: 'material-symbols:sliders'
  },
  slider: {
    name: 'Slider',
    icon: 'mdi:slider'
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
  number: {
    name: 'Number',
    icon: 'mdi:numeric'
  },
  object: {
    name: 'Object',
    icon: 'material-symbols:account-tree-outline',
    active: 'material-symbols:account-tree'
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
