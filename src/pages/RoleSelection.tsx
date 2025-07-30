import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Wrench, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const selectRole = (role: "client" | "provider") => {
    // In a real app, this would save the role to user context/state
    navigate("/onboarding", { state: { role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light to-accent-light flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-4xl px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('roleSelection.chooseYourRole')}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {t('roleSelection.howToUse')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Client Card */}
          <Card className="relative overflow-hidden shadow-[var(--shadow-elegant)] hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                onClick={() => selectRole("client")}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="text-center pb-6">
              <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <User className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t('roleSelection.client')}</CardTitle>
              <CardDescription className="text-lg">
                {t('roleSelection.clientDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  {t('roleSelection.findSkilled')}
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  {t('roleSelection.postJobs')}
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  {t('roleSelection.hireTrusted')}
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-primary mr-2" />
                  {t('roleSelection.rateReview')}
                </li>
              </ul>
              <Button 
                variant="outline" 
                className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground"
              >
                {t('roleSelection.continueAsClient')}
              </Button>
            </CardContent>
          </Card>

          {/* Provider Card */}
          <Card className="relative overflow-hidden shadow-[var(--shadow-elegant)] hover:shadow-xl transition-all duration-300 cursor-pointer group" 
                onClick={() => selectRole("provider")}>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="text-center pb-6">
              <div className="w-24 h-24 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-12 h-12 text-accent" />
              </div>
              <CardTitle className="text-2xl">{t('roleSelection.provider')}</CardTitle>
              <CardDescription className="text-lg">
                {t('roleSelection.providerDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  {t('roleSelection.showcaseSkills')}
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  {t('roleSelection.findJobs')}
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  {t('roleSelection.setRates')}
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-accent mr-2" />
                  {t('roleSelection.buildReputation')}
                </li>
              </ul>
              <Button 
                variant="accent" 
                className="w-full mt-6"
              >
                {t('roleSelection.continueAsProvider')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;