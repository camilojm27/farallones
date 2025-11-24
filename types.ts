export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface CustomField {
    id: number;
    community_id: number;
    name: string;
    slug: string;
    type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'checkbox' | 'radio';
    is_required: boolean;
    options: any;
}

export interface Event {
    id: number;
    community_id: number;
    creator_id: number;
    name: string;
    description: string;
    type: 'online' | 'in_person' | 'hybrid';
    location: string;
    image: string;
    start_time: string;
    end_time: string;
    transport_enabled: boolean;
}

export interface Community {
    id: number;
    owner_id: number;
    name: string;
    slug: string;
    description: string;
    verified: boolean;
    logo: string;
    banner: string;
    NIT: string;
    legal_representative: string;
    address: string;
    phone_number: string;
    email: string;
    website: string;
    custom_fields?: CustomField[];
    events?: Event[];
    is_member?: boolean;
    is_owner?: boolean;
}
