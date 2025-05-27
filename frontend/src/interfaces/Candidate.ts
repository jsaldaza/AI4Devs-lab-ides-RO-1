export interface Education {
    id?: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    candidateId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface WorkExperience {
    id?: number;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    technologies?: string[];
    achievements?: string;
    candidateId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    technicalSkills?: string[];
    yearsOfExperience?: number;
    currentPosition?: string;
    preferredRole?: string;
    cvFileUrl?: string;
    isActive?: boolean;
    dataRetentionDate?: string;
    education: Education[];
    workExperience: WorkExperience[];
    documents?: any[];
    createdAt?: string;
    updatedAt?: string;
} 