interface kerberosDescriptorProperty {
  name: string;
  index: number;
  placeholderText?: string;
}

const kerberosDescriptorProperties: kerberosDescriptorProperty[] = [
    {
      "name": "keytab_dir",
      "index": 3
    },
    {
      "name": "realm",
      "index": 4
    },
    {
      "name": "additional_realms",
      "index": 5,
      "placeholderText": "common.optional"
    },
    {
      "name": "principal_suffix",
      "index": 6,
      "placeholderText": "common.optional"
    }
];

export { kerberosDescriptorProperties }


