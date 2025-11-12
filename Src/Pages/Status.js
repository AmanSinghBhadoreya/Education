
import {useStateate, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
const Status = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
if (userError || !user) {
          toast({
            title: "Authentication required",
            description: "Please log in to view your applications",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        setUser(user);

        // Fetch user's applications
        const { data, error } = await supabase
          .from("loan_applications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
if (error) throw error;

        setApplications(data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load your applications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplications();
  }, [navigate, toast]);
const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
      case "disbursed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-50" />; // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "disbursed":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // RENDER THE PAGE
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your loan applications</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You haven't submitted any applications yet</p>
              <Button onClick={() => navigate("/apply")}>Apply Now</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        Application #{app.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription>
                        Submitted on {new Date(app.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Application Score */}
                  {app.score && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Application Score</span>
                        <span className="text-sm font-medium">{(app.score * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={app.score * 100} />
                    </div>
                  )}

                  {/* Loan Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="font-semibold">${app.loan_amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Term</p>
                      <p className="font-semibold">{app.loan_term_months} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="font-semibold">{app.interest_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Decision</p>
                      <p className="font-semibold">{app.decision || "Pending"}</p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  {app.breakdown && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Score Breakdown</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(app.breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="font-medium">
                              {(value.contribution * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

