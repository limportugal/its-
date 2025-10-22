import React, { useState, useCallback, useMemo, memo } from "react";
import { Box, Popover, Typography } from "@mui/material";

interface HoverableCellProps {
    children: React.ReactNode;
    categories: any[];
    title: string;
}

const HoverableCell: React.FC<HoverableCellProps> = memo(({ 
    children, 
    categories, 
    title 
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setAnchorEl(null);
    }, []);

    // Memoize the categories list to prevent unnecessary re-renders
    const memoizedCategories = useMemo(() => {
        return categories || [];
    }, [categories]);

    return (
        <>
            <span 
                style={{ 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap",
                    flex: 1,
                    cursor: "help"
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </span>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleMouseLeave}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableRestoreFocus
                sx={{
                    pointerEvents: 'none',
                }}
            >
                <Box sx={{ p: 2, maxWidth: 300, pointerEvents: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {title}:
                    </Typography>
                    {memoizedCategories && memoizedCategories.length > 0 ? (
                        <Box>
                            {memoizedCategories.map((cat) => (
                                <Typography 
                                    key={cat.id} 
                                    variant="body2" 
                                    sx={{ 
                                        mb: 0.5,
                                        '&:last-child': { mb: 0 }
                                    }}
                                >
                                    • {cat.category_name}
                                </Typography>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No categories
                        </Typography>
                    )}
                </Box>
            </Popover>
        </>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    const categoriesEqual = JSON.stringify(prevProps.categories) === JSON.stringify(nextProps.categories);
    const titleEqual = prevProps.title === nextProps.title;
    const childrenEqual = prevProps.children === nextProps.children;
    
    const shouldNotRerender = categoriesEqual && titleEqual && childrenEqual;
    
    return shouldNotRerender;
});

HoverableCell.displayName = 'HoverableCell';

export default HoverableCell;
