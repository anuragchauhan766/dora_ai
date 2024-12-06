export interface NavMainItems {
    title: string;
    url: string;
    isActive?: boolean;
    icon: React.ReactNode
    items?: {
        title: string;
        url: string;
    }[];
}