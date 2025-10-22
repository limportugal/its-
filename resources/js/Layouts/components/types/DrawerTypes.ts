import { ReactElement } from 'react';

export interface MenuItem {
    title: string;
    icon: ReactElement;
    route?: string;
    children?: {
        title: string;
        icon: ReactElement;
        route: string;
    }[];
    kind?: 'divider';
    key?: string;
    tooltip?: string;
}

export interface DrawerComponentProps {
    mobileOpen: boolean;
    handleDrawerClose: () => void;
    handleDrawerTransitionEnd: () => void;
    isMiniDrawer: boolean;
    handleDrawerToggle?: () => void;
    userPermissions?: string[];
}

export interface MenuItemProps {
    item: MenuItem;
    index: number;
    selected: string | null;
    open: Record<number, boolean>;
    isMiniDrawer: boolean;
    handleToggle: (index: number) => void;
    handleSelect: (index: string) => void;
}

export interface SubMenuItemProps {
    child: {
        title: string;
        icon: ReactElement;
        route: string;
        key?: string;
    };
    childIndex: number;
    parentIndex: number;
    selected: string | null;
    isMiniDrawer: boolean;
    handleSelect: (index: string) => void;
    userPermissions?: string[];
} 