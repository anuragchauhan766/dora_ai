export interface NavMainItems {
    title: string;
    url: string;
    isActive?: boolean;
    icon: React.FC
    items?: {
        title: string;
        url: string;
    }[];
}