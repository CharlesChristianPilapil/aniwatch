import { Tab, Tabs } from "@mui/material";
import { useState, type ReactElement, type SyntheticEvent } from "react";
import useGetScreenSize from "../hooks/useGetScreenSize";
import { BREAKPOINTS } from "../utils/constants/utils";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ProfileForm from "../components/Form/Settings/ProfileForm";
import SecurityForm from "../components/Form/Settings/SecurityForm";
import PageTitle from "../components/PageTitle";

type TabsType = "profile" | "security" | "notifications" | "privacy";

type TabPanelProps = {
    children?: React.ReactNode;
    panelId: TabsType;
    value: TabsType;
}

const TabItems: { value: TabsType, label: string, icon: ReactElement }[] = [
    { value: "profile", label: "Profile", icon: <AccountCircleIcon />},
    { value: "security", label: "Security", icon: <NoEncryptionIcon />},
    { value: "notifications", label: "Notifications", icon: <NotificationsIcon /> },
    { value: "privacy", label: "Privacy", icon: <VerifiedUserIcon /> },
];

const TabPanel = (props: TabPanelProps) => {
    const { children, value, panelId, ...other } = props;

    return value === panelId ? (
        <div
            role="tabpanel"
            hidden={value !== panelId}
            id={`tabpanel-${panelId}`}
            aria-labelledby={`tab-${panelId}`}
            className="bg-main/15 rounded flex-1 w-full h-fit"
            {...other}

        >
            {children}
        </div>
    ) : null;
};

const SettingsPage = () => {

    const { width } = useGetScreenSize();
    const [activeTab, setActiveTab] = useState<TabsType>("profile");

    const a11yProps = (value: TabsType) => {
        return {
            value,
            id: `tab-${value}`,
            'aria-controls': `tabpanel-${value}`,
            className: 'text-main [&.Mui-selected]:text-secondary-accent [&.Mui-selected]:bg-main/25 [&.Mui-selected]:rounded',
            sx: { 
                justifyContent: width > BREAKPOINTS.LG ? "flex-start" : "center", 
                "& .MuiTab-wrapper": {
                    fontSize: "0.875rem",
                },
            }
        }
    }

    const handleChangeTabs = (_event: SyntheticEvent, newValue: TabsType) => {
        setActiveTab(newValue)
    };

    return (
        <>
            <PageTitle title="Settings" />
            <main className="container max-w-[1280px] space-y-10 pt-10">
                <h2 className="font-semibold"> My Account </h2>
                <div className="lg:flex space-y-4 lg:gap-4 lg:space-y-0">
                    <Tabs
                        orientation={width >= BREAKPOINTS.LG ? "vertical" : "horizontal"}
                        value={activeTab}
                        onChange={handleChangeTabs}
                        variant={width < 560 ? "scrollable" : "standard"}
                        centered={width >= 560}
                        scrollButtons
                        allowScrollButtonsMobile
                        className="lg:border-r lg:border-r-main/25 lg:bg-main/15 lg:h-fit rounded lg:w-[188px]"
                        slotProps={{
                            indicator: {
                                className: "bg-primary-accent"
                            }
                        }}
                        sx={{
                            "& .MuiTab-root": {
                                minHeight: width >= BREAKPOINTS.LG ? 72 : 48,
                                alignItems: "center",
                                fontSize: 12
                            },
                        }}
                    >
                        {TabItems.map((tab) => (
                            <Tab 
                                key={tab.value}
                                label={tab.label}
                                icon={tab.icon}
                                iconPosition="start"
                                {...a11yProps(tab.value)}
                            />
                        ))}
                    </Tabs>
                    <TabPanel value={activeTab} panelId="profile">
                        <ProfileForm />
                    </TabPanel>
                    <TabPanel value={activeTab} panelId="security">
                        <SecurityForm />
                    </TabPanel>
                    <TabPanel value={activeTab} panelId="notifications">
                        <div className="text-center py-10">
                            <p> Not yet available </p>
                        </div>
                    </TabPanel>
                    <TabPanel value={activeTab} panelId="privacy">
                        <div className="text-center py-10">
                            <p> Not yet available </p>
                        </div>
                    </TabPanel>
                </div>
            </main>
        </>
    );
};

export default SettingsPage;