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
    <div className="min-h-screen subtle-gradient relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 glow-effect opacity-20"></div>
      <div className="absolute top-10 left-20 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-success/10 blur-2xl"></div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl px-4">
          {/* Enhanced Header */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <div className="mb-8">
              <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
                {t('roleSelection.chooseYourRole')}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-primary via-accent to-primary mx-auto rounded-full mb-6"></div>
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('roleSelection.howToUse')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Enhanced Client Card */}
            <Card 
              className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-primary/5 shadow-[var(--shadow-hero)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 cursor-pointer group animate-slide-in-right hover:scale-[1.02]" 
              onClick={() => selectRole("client")}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-hover"></div>
              
              <CardHeader className="text-center pb-8 pt-8">
                <div className="relative mb-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-inner">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-primary-hover rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
                
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                  {t('roleSelection.client')}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                  {t('roleSelection.clientDesc')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                <ul className="space-y-4">
                  {[
                    t('roleSelection.findSkilled'),
                    t('roleSelection.postJobs'),
                    t('roleSelection.hireTrusted'),
                    t('roleSelection.rateReview')
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors duration-300">
                        <ArrowRight className="w-3 h-3 text-primary group/item-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-8 h-12 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-semibold rounded-xl shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <span className="flex items-center gap-2">
                    {t('roleSelection.continueAsClient')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Provider Card */}
            <Card 
              className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-accent/5 shadow-[var(--shadow-hero)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 cursor-pointer group animate-slide-in-right hover:scale-[1.02]" 
              onClick={() => selectRole("provider")}
              style={{ animationDelay: '0.5s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-accent/80"></div>
              
              <CardHeader className="text-center pb-8 pt-8">
                <div className="relative mb-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/90 rounded-full flex items-center justify-center shadow-inner">
                      <Wrench className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-accent to-accent/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
                
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent mb-2">
                  {t('roleSelection.provider')}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                  {t('roleSelection.providerDesc')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                <ul className="space-y-4">
                  {[
                    t('roleSelection.showcaseSkills'),
                    t('roleSelection.findJobs'),
                    t('roleSelection.setRates'),
                    t('roleSelection.buildReputation')
                  ].map((item, index) => (
                    <li key={index} className="flex items-center group/item">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors duration-300">
                        <ArrowRight className="w-3 h-3 text-accent group/item-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-8 h-12 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-semibold rounded-xl shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <span className="flex items-center gap-2">
                    {t('roleSelection.continueAsProvider')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;