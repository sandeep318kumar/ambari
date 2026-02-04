export default{
  "moveJNConfig": {
    serviceName: 'MISC',
    displayName: 'MISC',
    configCategories: [
      { name: 'HDFS', displayName: 'HDFS'}
    ],
    sites: ['hdfs-site'],
    configs: [
      {
        "name": "dfs.namenode.shared.edits.dir",
        "displayName": "dfs.namenode.shared.edits.dir",
        "description": " The URI which identifies the group of JNs where the NameNodes will write/read edits.",
        "isReconfigurable": false,
        "recommendedValue": "qjournal://node1.example.com:8485;node2.example.com:8485;node3.example.com:8485/mycluster",
        "value": "qjournal://node1.example.com:8485;node2.example.com:8485;node3.example.com:8485/mycluster",
        "category": "HDFS",
        "filename": "hdfs-site",
        "serviceName": 'MISC',
        "presentForNonFederatedHDFS": true,
        "presentForFederatedHDFS": false,
        "dependsOnNameServiceId": false
      },
      {
        "name": "dfs.namenode.shared.edits.dir.{{namespaceId}}",
        "displayName": "dfs.namenode.shared.edits.dir.{{namespaceId}}",
        "description": "The URI which identifies the group of JNs where the NameNodes will write/read edits.",
        "isReconfigurable": false,
        "recommendedValue": "qjournal://{{journalnodes}}/{{namespaceId}}",
        "value": "qjournal://{{journalnodes}}/{{namespaceId}}",
        "category": "HDFS",
        "filename": "hdfs-site",
        "presentForNonFederatedHDFS": false,
        "presentForFederatedHDFS": true,
        "dependsOnNameServiceId": true
      }
    ]
  }
};

