import React from 'react';
import { Link } from "@inertiajs/react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { SubMenuItemProps } from './types/DrawerTypes';

const SubMenuItem: React.FC<SubMenuItemProps> = ({
    child,
    childIndex,
    parentIndex,
    selected,
    isMiniDrawer,
    handleSelect
}) => {
    return (
        <ListItem key={child.route} disablePadding>
            <ListItemButton
                component={Link}
                href={child.route}
                onClick={() => handleSelect(`${parentIndex}-${childIndex}`)}
                sx={{
                    mx: 1,
                    py: 1,
                    pl: 4,
                    backgroundColor:
                        selected === `${parentIndex}-${childIndex}`
                            ? "#e3eefa"
                            : "transparent",
                    borderRadius: 2,
                    "&:hover": {
                        backgroundColor: "#f5f5f5",
                    },
                }}
            >
                <Tooltip
                    title={isMiniDrawer ? child.title : ""}
                    placement="right"
                >
                    <ListItemIcon
                        sx={{
                            px: 2,
                            color:
                                selected === `${parentIndex}-${childIndex}`
                                    ? "#1565c0"
                                    : "",
                        }}
                    >
                        {child.icon}
                    </ListItemIcon>
                </Tooltip>
                <ListItemText primary={child.title} />
            </ListItemButton>
        </ListItem>
    );
};

export default React.memo(SubMenuItem); 