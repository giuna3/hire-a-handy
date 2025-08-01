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
      { key: "electrician", translationKey: "subcategories.electrician" },
      { key: "plumber", translationKey: "subcategories.plumber" },
      { key: "mechanic", translationKey: "subcategories.mechanic" },
      { key: "carpenter", translationKey: "subcategories.carpenter" },
      { key: "painter", translationKey: "subcategories.painter" },
      { key: "plumbing", translationKey: "subcategories.plumbing" },
      { key: "electrical", translationKey: "subcategories.electrical" },
      { key: "generalRepairs", translationKey: "subcategories.generalRepairs" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "petcare",
    translationKey: "categories.petcare",
    subcategories: [
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "gardening",
    translationKey: "categories.gardening",
    subcategories: [
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "childcare",
    translationKey: "categories.childcare",
    subcategories: [
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "beautyWellness",
    translationKey: "categories.beautyWellness",
    subcategories: [
      { key: "makeupArtist", translationKey: "subcategories.makeupArtist" },
      { key: "massageTherapy", translationKey: "subcategories.massageTherapy" },
      { key: "nailTechnician", translationKey: "subcategories.nailTechnician" },
      { key: "personalTrainer", translationKey: "subcategories.personalTrainer" },
      { key: "yogaMeditation", translationKey: "subcategories.yogaMeditation" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "creativeServices",
    translationKey: "categories.creativeServices",
    subcategories: [
      { key: "photography", translationKey: "subcategories.photography" },
      { key: "videography", translationKey: "subcategories.videography" },
      { key: "djMusician", translationKey: "subcategories.djMusician" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "eventServices",
    translationKey: "categories.eventServices",
    subcategories: [
      { key: "eventPlanning", translationKey: "subcategories.eventPlanning" },
      { key: "hostHostess", translationKey: "subcategories.hostHostess" },
      { key: "decorationServices", translationKey: "subcategories.decorationServices" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "techFreelance",
    translationKey: "categories.techFreelance",
    subcategories: [
      { key: "websiteCreation", translationKey: "subcategories.websiteCreation" },
      { key: "graphicDesign", translationKey: "subcategories.graphicDesign" },
      { key: "socialMediaManagement", translationKey: "subcategories.socialMediaManagement" },
      { key: "copywritingTranslation", translationKey: "subcategories.copywritingTranslation" },
      { key: "videoEditing", translationKey: "subcategories.videoEditing" },
      { key: "appDevelopment", translationKey: "subcategories.appDevelopment" },
      { key: "seoAdsSetup", translationKey: "subcategories.seoAdsSetup" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "transportation",
    translationKey: "categories.transportation",
    subcategories: [
      { key: "driverWithCar", translationKey: "subcategories.driverWithCar" },
      { key: "motorcycleCourier", translationKey: "subcategories.motorcycleCourier" },
      { key: "foodPackageDelivery", translationKey: "subcategories.foodPackageDelivery" },
      { key: "airportPickup", translationKey: "subcategories.airportPickup" },
      { key: "carWashing", translationKey: "subcategories.carWashing" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  },
  {
    key: "businessHelp",
    translationKey: "categories.businessHelp",
    subcategories: [
      { key: "accounting", translationKey: "subcategories.accounting" },
      { key: "adminVirtualAssistant", translationKey: "subcategories.adminVirtualAssistant" },
      { key: "customerService", translationKey: "subcategories.customerService" },
      { key: "dataEntry", translationKey: "subcategories.dataEntry" },
      { key: "resumeWriting", translationKey: "subcategories.resumeWriting" },
      { key: "legalSupport", translationKey: "subcategories.legalSupport" },
      { key: "other", translationKey: "subcategories.other" }
    ]
  }
];