
const superMasters = ["HBASE_MASTER", "ZOOKEEPER_SERVER", "METRICS_COLLECTOR", "SPARK3_JOBHISTORYSERVER", "TRINO_COORDINATOR"]

const versionStateMap = {
    'current': {
      'type': 'CURRENT',
      'value': ['CURRENT'],
      'property': 'currentHosts',
      'label': "Current"
    },
    'installed': {
      'type': 'INSTALLED',
      'value': ['INSTALLED'],
      'property': 'installedHosts',
      'label': "Installed"
    },
    'not_installed': {
      'type': 'NOT_INSTALLED',
      'value': ['INSTALLING', 'INSTALL_FAILED', 'OUT_OF_SYNC', 'NOT_REQUIRED'],
      'property': 'notInstalledHosts',
      'label': "Not installed"
    }
}
export { superMasters,versionStateMap, }