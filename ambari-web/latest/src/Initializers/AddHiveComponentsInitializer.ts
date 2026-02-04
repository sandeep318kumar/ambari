import AddComponentConfigInitializer from "./AddComponentConfigInitializer.ts";

class AddHiveComponentsInitializer extends AddComponentConfigInitializer {
  //@ts-ignore
  private initializeForProperties: string[];

  constructor() {
    super();
    this.initializeForProperties = [
      "hive.metastore.uris",
      "templeton.hive.properties",
      "hadoop.proxyuser.{{hiveUser}}.hosts",
    ];

    this.defaultInitializers = Object.keys(this.defaultInitializers)
      .filter((key) => this.initializeForProperties.includes(key))
      .reduce((filteredInitializers, key) => {
        filteredInitializers[key] = this.defaultInitializers[key];
        return filteredInitializers;
      }, {} as Record<string, any>);
  }
}

export default AddHiveComponentsInitializer;
