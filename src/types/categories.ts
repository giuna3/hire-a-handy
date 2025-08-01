export interface SubCategory {
  key: string;
  translationKey: string;
}

export interface Category {
  key: string;
  translationKey: string;
  subcategories?: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    key: "tutoring",
    translationKey: "categories.tutoring",
    subcategories: [
      { key: "math", translationKey: "subcategories.math" },
      { key: "physics", translationKey: "subcategories.physics" },
      { key: "georgian", translationKey: "subcategories.georgian" },
      { key: "english", translationKey: "subcategories.english" },
      { key: "russian", translationKey: "subcategories.russian" },
      { key: "otherLanguage", translationKey: "subcategories.otherLanguage" },
      { key: "biology", translationKey: "subcategories.biology" },
      { key: "chemistry", translationKey: "subcategories.chemistry" },
      { key: "geography", translationKey: "subcategories.geography" },
      { key: "history", translationKey: "subcategories.history" },
      { key: "elementary", translationKey: "subcategories.elementary" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "cleaning",
    translationKey: "categories.cleaning",
    subcategories: [
      { key: "houseCleaning", translationKey: "subcategories.houseCleaning" },
      { key: "deepCleaning", translationKey: "subcategories.deepCleaning" },
      { key: "officeCleaning", translationKey: "subcategories.officeCleaning" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "handyman",
    translationKey: "categories.handyman",
    subcategories: [
      { key: "plumbing", translationKey: "subcategories.plumbing" },
      { key: "electrical", translationKey: "subcategories.electrical" },
      { key: "generalRepairs", translationKey: "subcategories.generalRepairs" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "petcare",
    translationKey: "categories.petcare"
  },
  {
    key: "gardening",
    translationKey: "categories.gardening"
  },
  {
    key: "childcare",
    translationKey: "categories.childcare"
  }
];