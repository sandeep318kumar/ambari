interface UIProperty {
  name: string;
  displayName: string;
  description?: string;
  displayType?: string;
  isRequiredByAgent?: boolean;
  isOverridable?: boolean;
  isVisible?: boolean;
  isRequired?: boolean;
  isReconfigurable?: boolean;
  serviceName: string;
  category: string;
  recommendedValue?: string | boolean;
  rowStyleClass?: string;
  filename: string;
  index?: number;
}

const kerberos_ui_properties: UIProperty[] = [
    {
        "name": "admin_principal",
        "displayName": "Admin principal",
        "description": "Admin principal used to create principals and export key tabs (e.g. admin/admin@EXAMPLE.COM).",
        "isRequiredByAgent": false,
        "serviceName": "KERBEROS",
        "filename": "krb5-conf.xml",
        "category": "Kadmin",
        "index": 1
      },
      {
        "name": "admin_password",
        "displayName": "Admin password",
        "displayType": "password",
        "isRequiredByAgent": false,
        "serviceName": "KERBEROS",
        "filename": "krb5-conf.xml",
        "category": "Kadmin",
        "index": 2
      },
      {
        "name": "persist_credentials",
        "displayName": "Save Admin Credentials",
        "description": "Save admin credentials for future use. When checked, credentials will be persisted if storage supports it; otherwise they will be temporary. This checkbox is always enabled regardless of storage support.",
        "displayType": "checkbox",
        "isRequiredByAgent": false,
        "isRequired": false,
        "serviceName": "KERBEROS",
        "filename": "krb5-conf.xml",
        "category": "Kadmin",
        "recommendedValue": false,
        "index": 3
      },
      {
        "name": "preconfigure_services",
        "displayName": "Pre-configure services",
        "description": "Indicates whether to pre-configure services or not. If pre-configuring services, indicates whether to pre-configure all or those explicitly flagged to be pre-configured. Possible values are DEFAULT, NONE, or ALL",
        "displayType": "string",
        "isRequiredByAgent": true,
        "isRequired": true,
        "serviceName": "KERBEROS",
        "filename": "kerberos-env.xml",
        "category": "Advanced kerberos-env",
        "recommendedValue": "DEFAULT",
        "index": 4
      },
]

export { kerberos_ui_properties };
export type { UIProperty };
