export interface VersionDefinitionResponse {
    href: string
    items: Item[]
}

export interface Item {
    href: string
    VersionDefinition: VersionDefinition
    operating_systems: OperatingSystem[]
}

export interface VersionDefinition {
    id: string
    repository_version: string
    show_available: boolean
    stack_default: boolean
    stack_name: string
    stack_repo_update_link_exists: boolean
    stack_services: StackService[]
    stack_version: string
    type: string
}

export interface StackService {
    name: string
    display_name: string
    comment: string
    versions: string[]
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
    version_definition_id: string
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
    version_definition_id: string
}
