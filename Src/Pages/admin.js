import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PENDING APPLICATIONS (only score >= 70%)
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("status", "pending")  // Only pending applications
        .gte("score", 0.7)  // Only applications with score >= 70%
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // APPROVE APPLICATION
  const handleApprove = async (applicationId) => {
    try {import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PENDING APPLICATIONS (only score >= 70%)
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("status", "pending")  // Only pending applications
        .gte("score", 0.7)  // Only applications with score >= 70%
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // APPROVE APPLICATION
  const handleApprove = async (applicationId) => {
    try
 {const { error } = await supabase
        .from("loan_applications")
        .update({ 
          status: "approved",
          decision: "Approved",
          updated_at: new Date().toISOString()
        })
        .eq("id", applicationId);

      if (error) throw error;

toast({
        title: "Application approved",
        description: "The application has been approved successfully",
      });

      // Refresh the list (removes approved item from pending)
      fetchApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  // REJECT APPLICATION
  const handleReject = async (applicationId) => {
    try {
      const { error } = await supabase
        .from("loan_applications")
        .update({ 
          status: "rejected",
          decision: "Rejected",
          updated_at: new Date().toISOString()
        })
        .eq("id", applicationId);

      if (error) throw error;
toast({
        title: "Application rejected",
        description: "The application has been rejected",
      });

      // Refresh the list (removes rejected item from view)
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  // RENDER THE DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Review and manage pending loan applications</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">toast({
        title: "Application rejected",
        description: "The application has been rejected",
      });

      // Refresh the list (removes rejected item from view)
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  // RENDER THE DASHBOARD
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Review and manage pending loan applications</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">


      