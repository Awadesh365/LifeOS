import type { FC } from 'react';
import type { ReactNode } from 'react';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  navigation?: ReactNode;
  hideSearch?: boolean;
  compactAvatar?: boolean;
}

declare const Header: FC<HeaderProps>;

export default Header;
