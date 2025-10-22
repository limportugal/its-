import React from 'react';
import { Link } from "@inertiajs/react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Collapse, List, Divider, Box, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { MenuItemProps } from './types/DrawerTypes';
import SubMenuItem from './SubMenuItem';

const MenuItem: React.FC<MenuItemProps> = ({
    item,
    index,
    selected,
    open,
    isMiniDrawer,
    handleToggle,
    handleSelect
}) => {
    if (item.kind === "divider") {
        return (
            <Divider
                key={`divider-${index}`}
                sx={{
                    m: 1,
                    borderColor: "ddd",
                    borderWidth: "1px",
                    borderRadius: "5px",
                }}
            />
        );
    }

    const menuItemContent = (
        <ListItem disablePadding>
            {isMiniDrawer ? (
                // Mini drawer with vertical layout (icon above, label below)
                <Box
                    component={item.route ? Link : "div"}
                    href={item.route || undefined}
                    onClick={() => {
                        if (item.children) {
                            handleToggle(index);
                        } else {
                            handleSelect(index.toString());
                        }
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        padding: "12px 8px",
                        backgroundColor:
                            selected === index.toString()
                                ? "#e3eefa"
                                : "transparent",
                        borderRadius: 2,
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": {
                            backgroundColor: "#f5f5f5",
                        },
                    }}
                >
                    <Box
                        sx={{
                            color: "#666666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                        }}
                    >
                        {item.icon}
                    </Box>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: "0.7rem",
                            textAlign: "center",
                            lineHeight: 1.2,
                            color:
                                selected === index.toString()
                                    ? "#1565c0"
                                    : "inherit",
                            wordBreak: "break-word",
                            maxWidth: "100%",
                        }}
                    >
                        {item.title}
                    </Typography>
                </Box>
            ) : (
                // Regular drawer with horizontal layout
                <ListItemButton
                    component={item.route ? Link : "div"}
                    href={item.route || undefined}
                    onClick={() => {
                        if (item.children) {
                            handleToggle(index);
                        } else {
                            handleSelect(index.toString());
                        }
                    }}
                    sx={{
                        backgroundColor:
                            selected === index.toString()
                                ? "#e3eefa"
                                : "transparent",
                        mx: 0,
                        my: 0.5,
                        borderRadius: 2,
                        "&:hover": {
                            backgroundColor: "#f5f5f5",
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color: "#666666",
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.children && (
                        open[index] ? <ExpandLess /> : <ExpandMore />
                    )}
                </ListItemButton>
            )}
        </ListItem>
    );

    return (
        <React.Fragment key={item.title}>
            {item.tooltip ? (
                <Tooltip 
                    title={item.tooltip} 
                    placement={isMiniDrawer ? "right" : "top"}
                    arrow
                >
                    {menuItemContent}
                </Tooltip>
            ) : (
                menuItemContent
            )}
            {item.children && !isMiniDrawer && (
                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child, childIndex) => (
                            <SubMenuItem
                                key={child.route}
                                child={child}
                                childIndex={childIndex}
                                parentIndex={index}
                                selected={selected}
                                isMiniDrawer={isMiniDrawer}
                                handleSelect={handleSelect}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </React.Fragment>
    );
};

export default React.memo(MenuItem); 