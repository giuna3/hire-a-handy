import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('googleMapsApiKey');
    if (!storedApiKey) {
      setIsOpen(true);
    } else {
      onApiKeySet(storedApiKey);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('googleMapsApiKey', apiKey.trim());
      onApiKeySet(apiKey.trim());
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('googleMapsApiKey');
    setApiKey('');
    setIsOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Google Maps API Key Required
            </DialogTitle>
            <DialogDescription>
              To display maps, please enter your Google Maps API key. This will be stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Maps API key"
                type="password"
              />
            </div>
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">How to get your API key:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to Google Cloud Console</li>
                <li>Enable the Maps JavaScript API</li>
                <li>Create credentials (API key)</li>
                <li>Restrict the key to your domain</li>
              </ol>
              <a 
                href="https://console.cloud.google.com/google/maps-apis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline mt-2"
              >
                Open Google Cloud Console
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <Button onClick={handleSave} disabled={!apiKey.trim()} className="w-full">
              Save API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings card for when API key is set */}
      {!isOpen && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Key className="w-4 h-4 mr-2" />
              Google Maps Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">API key configured</p>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                  Update
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ApiKeySetup;