import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  rate_type: string;
  duration_minutes: number;
  is_active: boolean;
}

const ProviderServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    rate: "",
    rate_type: "hourly",
    duration_minutes: "60"
  });

  const categories = [
    "Cleaning", "Deep Cleaning", "Home Repair", "Gardening", 
    "Plumbing", "Electrical", "Painting", "Moving", 
    "Tutoring", "Pet Care", "Personal Training", "Photography",
    "Beauty & Wellness", "IT Support", "Event Planning"
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to view your services");
        return;
      }

      const { data: services, error } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
        return;
      }

      setServices(services || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to manage services");
        return;
      }

      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        rate: parseFloat(formData.rate),
        rate_type: formData.rate_type,
        duration_minutes: parseInt(formData.duration_minutes),
        provider_id: user.id,
        is_active: true
      };

      let error;
      if (editingService) {
        // Update existing service
        const { error: updateError } = await (supabase as any)
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        error = updateError;
      } else {
        // Create new service
        const { error: insertError } = await (supabase as any)
          .from('services')
          .insert([serviceData]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving service:', error);
        toast.error('Failed to save service');
        return;
      }

      toast.success(editingService ? 'Service updated successfully!' : 'Service created successfully!');
      setIsDialogOpen(false);
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        rate: "",
        rate_type: "hourly",
        duration_minutes: "60"
      });
      fetchServices();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      rate: service.rate.toString(),
      rate_type: service.rate_type,
      duration_minutes: service.duration_minutes.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
        return;
      }

      toast.success('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete service');
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating service status:', error);
        toast.error('Failed to update service status');
        return;
      }

      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchServices();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update service status');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Services</h1>
            <p className="text-muted-foreground">Manage your services and hourly rates</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingService(null);
                setFormData({
                  title: "",
                  description: "",
                  category: "",
                  rate: "",
                  rate_type: "hourly",
                  duration_minutes: "60"
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Update your service details and pricing.' : 'Create a new service with your hourly rate and details.'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., House Cleaning, Plumbing Repair"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate (₾)</Label>
                    <Input
                      id="rate"
                      type="number"
                      placeholder="50"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rate_type">Rate Type</Label>
                    <Select value={formData.rate_type} onValueChange={(value) => setFormData({ ...formData, rate_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Per Hour</SelectItem>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="daily">Per Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first service with an hourly rate
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className={`${!service.is_active ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {service.title}
                        <Badge variant={service.is_active ? "default" : "secondary"}>
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{service.category}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₾{service.rate}</p>
                      <p className="text-sm text-muted-foreground">per {service.rate_type}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {service.description && (
                      <p className="text-muted-foreground">{service.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration_minutes} minutes</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      
                      <Button
                        variant={service.is_active ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleServiceStatus(service.id, service.is_active)}
                      >
                        {service.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderServices;