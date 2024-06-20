import Header from './header.vue'
import HeaderTitle from './header-title.vue'

type HeaderComponent = typeof Header & {
  Title: typeof HeaderTitle
}

const HeaderElement = Header as HeaderComponent
HeaderElement.Title = HeaderTitle

export default HeaderElement
export { HeaderTitle, Header }
