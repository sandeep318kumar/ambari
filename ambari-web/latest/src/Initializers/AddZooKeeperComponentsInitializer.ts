import AddComponentConfigInitializer from "./AddComponentConfigInitializer.ts";
class AddZooKeeperComponentsInitializer extends AddComponentConfigInitializer {
    //@ts-ignore
    private initializeForProperties: any;
    constructor() {
        super();
        //@ts-ignore
        this.initializeForProperties = [
            'zookeeper.connect',
            'ha.zookeeper.quorum',
            'hbase.zookeeper.quorum',
            'instance.zookeeper.host',
            'templeton.zookeeper.hosts',
            'hive.cluster.delegation.token.store.zookeeper.connectString',
            'yarn.resourcemanager.zk-address',
            'hive.zookeeper.quorum',
            'storm.zookeeper.servers',
            'hadoop.registry.zk.quorum',
            'atlas.audit.hbase.zookeeper.quorum',
            'atlas.graph.index.search.solr.zookeeper-url',
            'atlas.graph.storage.hostname',
            'atlas.kafka.zookeeper.connect'
        ]
        this.defaultInitializers = Object.keys(this.defaultInitializers)
            .filter((key) => this.initializeForProperties.includes(key))
            .reduce((filteredInitializers, key) => {
                filteredInitializers[key] = this.defaultInitializers[key];
                return filteredInitializers;
            }, {} as Record<string, any>);

        this.defaultUniqueInitializers = Object.keys(this.defaultUniqueInitializers)
            .filter((key) => this.initializeForProperties.includes(key))
            .reduce((filteredInitializers, key) => {
                filteredInitializers[key] = this.defaultUniqueInitializers[key];
                return filteredInitializers;
            }, {} as Record<string, any>);
    }
}

export default AddZooKeeperComponentsInitializer;
