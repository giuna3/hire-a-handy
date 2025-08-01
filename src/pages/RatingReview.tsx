import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RatingReview = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock job data - in real app this would come from params/state
  const jobData = {
    title: "Service Booking",
    provider: "Service Provider",
    date: "Today",
    amount: 50
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/client-bookings");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/client-bookings")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('ratingReview.back')}
          </Button>
          <h1 className="text-xl font-semibold ml-4">{t('ratingReview.title')}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="shadow-[var(--shadow-elegant)]">
          <CardHeader className="text-center">
            <CardTitle>{t('ratingReview.howWasExperience')}</CardTitle>
            <CardDescription>
              {t('ratingReview.helpOtherClients')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Summary */}
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{jobData.title}</h3>
              <p className="text-muted-foreground">{t('ratingReview.provider')}: {jobData.provider}</p>
              <p className="text-muted-foreground">{t('ratingReview.date')}: {jobData.date}</p>
              <p className="text-muted-foreground">{t('ratingReview.amount')}: ₾{jobData.amount}</p>
            </div>

            {/* Rating */}
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-4">{t('ratingReview.rateService')}</h4>
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {rating === 0 && t('ratingReview.tapToRate')}
                {rating === 1 && t('ratingReview.poor')}
                {rating === 2 && t('ratingReview.fair')}
                {rating === 3 && t('ratingReview.good')}
                {rating === 4 && t('ratingReview.veryGood')}
                {rating === 5 && t('ratingReview.excellent')}
              </p>
            </div>

            {/* Review */}
            <div className="space-y-2">
              <h4 className="font-semibold">{t('ratingReview.leaveReview')}</h4>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={t('ratingReview.shareDetails')}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {t('ratingReview.reviewVisible')}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? t('ratingReview.submitting') : t('ratingReview.submitReview')}
            </Button>

            {/* Skip Option */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/client-bookings")}
                className="text-muted-foreground"
              >
                {t('ratingReview.skipForNow')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RatingReview;