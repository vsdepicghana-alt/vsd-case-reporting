export const diseaseConfig = {
  tuberculosis: {
    species: ["cattle"],
    requiresVaccination: false,
  },

  rabies: {
    species: ["dog", "cat"],
    requiresVaccination: true,
  },

  "viral haemorrhagic fever": {
    species: ["cattle", "goat", "sheep"],
    requiresVaccination: false,
  },

  anthrax: {
    species: ["cattle", "goat", "sheep"],
    requiresVaccination: true,
  },

  "avian influenza": {
    species: ["poultry"],
    requiresVaccination: false,
  },

  trypanosomiasis: {
    species: ["cattle", "goat", "sheep"],
    requiresVaccination: false,
  },
};