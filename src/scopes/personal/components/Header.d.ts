declare module './Header.jsx' {
  import { FC } from 'react';
  interface HeaderProps {
    title: string;
    subtitle?: string;
  }
  const Header: FC<HeaderProps>;
  export default Header;
}
