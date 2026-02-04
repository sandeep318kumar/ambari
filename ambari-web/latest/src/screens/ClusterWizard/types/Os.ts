export interface VersionOperatingSystem {
    href: string
    Versions: Versions
    operating_systems: OperatingSystem[]
}

export interface Versions {
    stack_name: string
    stack_version: string
}

export interface OperatingSystem {
    href: string
    OperatingSystems: OperatingSystems
    repositories: Repository[]
}

export interface OperatingSystems {
    os_type: string
    stack_name: string
    stack_version: string
}

export interface Repository {
    href: string
    Repositories: Repositories
}

export interface Repositories {
    applicable_services: any[]
    base_url: string
    components: any
    default_base_url: string
    distribution: any
    mirrors_list: any
    os_type: string
    repo_id: string
    repo_name: string
    stack_name: string
    stack_version: string
    tags: string[]
    unique: boolean
}

export interface TransformedOperatingSystem{
    os:string;
    isAdded:boolean;
    repos: TransformedRepo[]
}

export interface TransformedRepo{
    id:string;
    baseUrl:string;
    defaultUrl:string;
    name:string;
    isEditable?:boolean;
    defaultId:string;
    hasError?:boolean;
}