const propertyNameMapping:any = {
    smokeuser: {
      displayName: "Smoke User",
      displayType: "user",
      category: "Users and Groups",
    },
    hive_user: {
      displayName: "Hive User",
      displayType: "user",
      category: "Users and Groups",
    },
    ambari_metrics_user: {
      displayName: "Ambari Metrics User",
      displayType: "user",
      category: "Users and Groups",
    },
    kms_group: {
      displayName: "KMS Group",
      displayType: "user",
      category: "Users and Groups",
    },
    kms_user: {
      displayName: "KMS User",
      displayType: "user",
      category: "Users and Groups",
    },
    ranger_group: {
      displayName: "Ranger Group",
      displayType: "user",
      category: "Users and Groups",
    },
    ranger_user: {
      displayName: "Ranger User",
      displayType: "user",
      category: "Users and Groups",
    },
    yarn_ats_user: {
      displayName: "Yarn ATS User",
      displayType: "user",
      category: "Users and Groups",
    },
    yarn_user: {
      displayName: "Yarn User",
      displayType: "user",
      category: "Users and Groups",
    },
    hdfs_user: {
      displayName: "HDFS User",
      displayType: "user",
      category: "Users and Groups",
    },
    proxyuser_group: {
      displayName: "Proxy User Group",
      displayType: "user",
      category: "Users and Groups",
    },
    hbase_user: {
      displayName: "HBase User",
      displayType: "user",
      category: "Users and Groups",
    },
    livy3_group: {
      displayName: "Livy3 Group",
      displayType: "user",
      category: "Users and Groups",
    },
    livy3_user: {
      displayName: "Livy3 User",
      displayType: "user",
      category: "Users and Groups",
    },
    mapred_user: {
      displayName: "Mapreduce User",
      displayType: "user",
      category: "Users and Groups",
    },
    spark_group: {
      displayName: "Spark3 Group",
      displayType: "user",
      category: "Users and Groups",
    },
    spark_user: {
      displayName: "Spark3 User",
      displayType: "user",
      category: "Users and Groups",
    },
    tez_user: {
      displayName: "Tez User",
      displayType: "user",
      category: "Users and Groups",
    },
    /* START GENAI */
    zk_user: {
      displayName: "ZooKeeper User",
      displayType: "user",
      category: "Users and Groups",
    },
    // Fix for TLHASD-1376: Add missing service users and groups
    user_group: {
      displayName: "Hadoop Group",
      displayType: "user",
      category: "Users and Groups",
    },
    hadoop_group: {
      displayName: "Hadoop Group",
      displayType: "user",
      category: "Users and Groups",
    },
    ambari_qa_user: {
      displayName: "Ambari QA User",
      displayType: "user",
      category: "Users and Groups",
    },
    oozie_user: {
      displayName: "Oozie User",
      displayType: "user",
      category: "Users and Groups",
    },
    falcon_user: {
      displayName: "Falcon User",
      displayType: "user",
      category: "Users and Groups",
    },
    storm_user: {
      displayName: "Storm User",
      displayType: "user",
      category: "Users and Groups",
    },
    kafka_user: {
      displayName: "Kafka User",
      displayType: "user",
      category: "Users and Groups",
    },
    atlas_user: {
      displayName: "Atlas User",
      displayType: "user",
      category: "Users and Groups",
    },
    /* END GENAI */
    "user_group__cluster-env": {
      displayName: "Hadoop Group",
      displayType: "user",
      category: "Users and Groups",
    },
  }


export default propertyNameMapping
