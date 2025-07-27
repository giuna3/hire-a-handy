import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RatingReview = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock job data - in real app this would come from props/params
  const jobData = {
    title: "House Cleaning",
    provider: "Sarah Johnson",
    date: "Today",
    amount: 75
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
            Back
          </Button>
          <h1 className="text-xl font-semibold ml-4">Rate & Review</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="shadow-[var(--shadow-elegant)]">
          <CardHeader className="text-center">
            <CardTitle>How was your experience?</CardTitle>
            <CardDescription>
              Help other clients by sharing your feedback about this service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Summary */}
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{jobData.title}</h3>
              <p className="text-muted-foreground">Provider: {jobData.provider}</p>
              <p className="text-muted-foreground">Date: {jobData.date}</p>
              <p className="text-muted-foreground">Amount: ${jobData.amount}</p>
            </div>

            {/* Rating */}
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-4">Rate the service</h4>
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
                {rating === 0 && "Tap a star to rate"}
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            {/* Review */}
            <div className="space-y-2">
              <h4 className="font-semibold">Leave a review (optional)</h4>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share details about your experience to help other clients..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Your review will be visible to other clients and help improve the service quality.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>

            {/* Skip Option */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/client-bookings")}
                className="text-muted-foreground"
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RatingReview;