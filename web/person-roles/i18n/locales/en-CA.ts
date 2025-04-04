export default {
  btn: {
    done: 'Done',
    cancel: 'Cancel'
  },
  enum: {
    officerRole: {
      CEO: 'Chief Executive Officer',
      TREASURER: 'Treasurer',
      CFO: 'Chief Financial Officer',
      SECRETARY: 'Secretary',
      PRESIDENT: 'President',
      ASSISTANT_SECRETARY: 'Assistant Secretary',
      VP: 'Vice President',
      OTHER: 'Other Office(s)',
      CHAIR: 'Chair'
    }
  },
  label: {
    address: 'Address',
    addressResidential: 'Residential Address',
    state: 'State',
    street: 'Street Address',
    streetAdditional: 'Additional Street Address (Optional)',
    streetName: 'Street Name',
    streetNumber: 'Street Number',
    unitNumber: 'Unit Number',
    unitNumberOpt: 'Unit Number (Optional)',
    country: 'Country',
    line1: 'Address Line 1',
    line2: 'Address Line 2 (Optional)',
    city: 'City',
    region: 'Region',
    regionOpt: 'Region (Optional)',
    province: 'Province',
    postalCode: 'Postal Code',
    zipCode: 'Zip Code',
    code: 'Code',
    mailingAddress: 'Mailing Address',
    deliveryAddress: 'Delivery Address',
    sameAsMailAddress: 'Same as Mailing Address',
    deliveryInstructions: 'Delivery Instructions',
    deliveryInstructionsOpt: 'Delivery Instructions (Optional)',
    locationDescription: 'Location Description',
    locationDescriptionOpt: 'Location Description (Optional)',
    addOfficer: 'Add Officer',
    name: 'Name',
    roles: 'Roles',
    firstName: 'First Name',
    middleNameOpt: 'Middle Name (Optional)',
    lastName: 'Last Name'
  },
  validation: {
    required: 'Required',
    fieldRequired: 'This field is required',
    minChars: 'Minimum of {count} characters is required.',
    address: {
      country: 'Please select a country',
      street: 'Please enter a street address',
      streetName: 'Please enter a street name',
      streetNumber: 'Please enter a street number',
      city: 'Please enter a city',
      region: 'Please select a region',
      postalCode: 'Please enter a postal code',
      unitNumber: 'Please enter a unit number'
    },
    name: {
      first: 'Please enter a first name',
      last: 'Please enter a last name',
      full: 'Please enter a full legal name'
    },
    role: {
      min: 'Choose at least one role'
    }
  },
  // components
  ConnectHeader: {
    title: 'BC Registries and Online Services'
  },
  ConnectBreadcrumb: {
    default: 'BC Registries and Online Services'
  }
}
