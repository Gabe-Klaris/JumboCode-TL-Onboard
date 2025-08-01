export interface User {
    id: string;
    seen: Set<string>;
    recommended: Record<string, boolean>;
}