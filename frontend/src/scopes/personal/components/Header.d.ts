import type { FC } from 'react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
}

declare const Header: FC<HeaderProps>;

export default Header;
