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
      { key: "elementary", translationKey: "subcategories.elementary" }
    ]
  },
  {
    key: "cleaning",
    translationKey: "categories.cleaning",
    subcategories: [
      { key: "houseCleaning", translationKey: "subcategories.houseCleaning" },
      { key: "deepCleaning", translationKey: "subcategories.deepCleaning" },
      { key: "officeCleaning", translationKey: "subcategories.officeCleaning" }
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
      { key: "generalRepairs", translationKey: "subcategories.generalRepairs" }
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
  },
  {
    key: "beautyWellness",
    translationKey: "categories.beautyWellness",
    subcategories: [
      { key: "makeupArtist", translationKey: "subcategories.makeupArtist" },
      { key: "massageTherapy", translationKey: "subcategories.massageTherapy" },
      { key: "nailTechnician", translationKey: "subcategories.nailTechnician" },
      { key: "personalTrainer", translationKey: "subcategories.personalTrainer" },
      { key: "yogaMeditation", translationKey: "subcategories.yogaMeditation" }
    ]
  },
  {
    key: "creativeServices",
    translationKey: "categories.creativeServices",
    subcategories: [
      { key: "photography", translationKey: "subcategories.photography" },
      { key: "videography", translationKey: "subcategories.videography" },
      { key: "djMusician", translationKey: "subcategories.djMusician" }
    ]
  },
  {
    key: "eventServices",
    translationKey: "categories.eventServices",
    subcategories: [
      { key: "eventPlanning", translationKey: "subcategories.eventPlanning" },
      { key: "hostHostess", translationKey: "subcategories.hostHostess" },
      { key: "decorationServices", translationKey: "subcategories.decorationServices" }
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
      { key: "seoAdsSetup", translationKey: "subcategories.seoAdsSetup" }
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
      { key: "carWashing", translationKey: "subcategories.carWashing" }
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
      { key: "legalSupport", translationKey: "subcategories.legalSupport" }
    ]
  }
];