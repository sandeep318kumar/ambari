import { Utility } from "./Utility";

// const InitialData = {
//   'app': {
//     'loginName': '',
//     'authenticated': false,
//     'configs': [],
//     'tags': [],
//     'tables': {
//       'filterConditions': {},
//       'displayLength': {},
//       'startIndex': {},
//       'sortingConditions': {},
//       'selectedItems': {}
//     }
//   },

//   'Installer': {},
//   'AddHost': {},
//   'AddService': {},
//   'WidgetWizard': {},
//   'KerberosWizard': {},
//   'ReassignMaster': {},
//   'AddSecurity': {},
//   'AddAlertDefinition': {
//     content: {}
//   },
//   'HighAvailabilityWizard': {},
//   'RMHighAvailabilityWizard': {},
//   'AddHawqStandbyWizard': {},
//   'RemoveHawqStandbyWizard': {},
//   'ActivateHawqStandbyWizard': {},
//   'RAHighAvailabilityWizard': {},
//   'NameNodeFederationWizard': {},
//   'RollbackHighAvailabilityWizard': {},
//   'MultipleNameNodeWizard': {},
//   'MainAdminStackAndUpgrade': {},
//   'KerberosDisable': {},
//   'tmp': {}

// };
export const LocalStorageOps = {

  setItem(key: string, value: string) {
    localStorage.setItem(key, Utility.encryptData(value));
  },

  getItem(key: string) {
    return Utility.decryptData(localStorage.getItem(key)||"");
  },

  // cleanUpLocalStorage() {
  //   localStorage.setItem("ambari", JSON.stringify(InitialData));
  // },

  // updateLastVisitedURL(url: string) {
  //   const hasCluster = JSON.parse(this.getItem("hasCluster") || "false");
  //   if (hasCluster) {
  //     this.setItem("lastVisitedURL", url);
  //   }
  // },

  // clearLastVisitedURL() {
  //   this.setItem("lastVisitedURL", "");
  // }
}
