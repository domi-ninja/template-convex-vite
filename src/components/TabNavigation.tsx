import { DashboardIcon, PersonIcon } from "@radix-ui/react-icons";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

interface Tab {
    id: string;
    label: string;
    mobileLabel?: string; // Optional shorter label for mobile
    path: string;
    icon?: React.ReactNode;
}

interface TabNavigationProps {
    variant?: "header" | "standalone";
}

const tabs: Tab[] = [
    {
        id: "home",
        label: "Home",
        path: "/",
        icon: <DashboardIcon className="h-4 w-4" />,
    },
    {
        id: "profile",
        label: "Profile Settings",
        mobileLabel: "Profile",
        path: "/profile",
        icon: <PersonIcon className="h-4 w-4" />,
    },
];

export function TabNavigation({ variant = "standalone" }: TabNavigationProps) {
    const location = useLocation();

    const isActiveTab = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    const getTabLabel = (tab: Tab) => {
        // Use mobile label for standalone variant (mobile), full label for header variant (desktop)
        return variant === "standalone" && tab.mobileLabel ? tab.mobileLabel : tab.label;
    };

    if (variant === "header") {
        return (
            <div className="flex space-x-6">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        to={tab.path}
                        className={cn(
                            "py-2 px-3 rounded-md font-medium text-sm transition-colors duration-200",
                            isActiveTab(tab.path)
                                ? "bg-primary/10 text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {tab.icon}
                            {getTabLabel(tab)}
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <nav className="border-b border-border bg-background">
            <div className="max-w-6xl mx-auto px-2 md:px-8">
                <div className="flex space-x-8">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            className={cn(
                                "py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                                isActiveTab(tab.path)
                                    ? "border-primary text-primary-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {tab.icon}
                                {getTabLabel(tab)}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
