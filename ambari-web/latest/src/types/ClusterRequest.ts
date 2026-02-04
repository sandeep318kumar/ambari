export interface ClusterRequests {
    itemTotal: string
    items: ClusterRequestItem[]
  }
  
  export interface ClusterRequestItem {
    Requests: Requests
  }
  
  export interface Requests {
    cluster_name: string
    end_time: number
    id: number
    progress_percent: number
    request_context: string
    request_status: string
    start_time: number
    user_name: string
  }
  