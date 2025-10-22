// components/CustomTabs.tsx
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

type TabItem = {
    label: React.ReactNode;
    value: string;
    content: React.ReactNode;
};

type CustomTabsProps = {
    tabs: TabItem[];
    defaultValue?: string;
    onChange?: (value: string) => void;
};

const CustomTabs: React.FC<CustomTabsProps> = ({
    tabs,
    defaultValue,
    onChange,
}) => {
    const [value, setValue] = React.useState(defaultValue || tabs[0]?.value || '');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    const currentTab = tabs.find((tab) => tab.value === value);

    return (
        <Box sx={{ 
            mt: 1,
            width: '100%',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fafafa'
        }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="custom tabs"
                sx={{
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#fafafa'
                }}
            >
                {tabs.map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
            </Tabs>
            <Box sx={{ 
                mt: 0,
                px: 1,
                pb: 1,
                backgroundColor: '#ffffff'
            }}>
                {currentTab?.content}
            </Box>
        </Box>
    );
};

export default CustomTabs;
