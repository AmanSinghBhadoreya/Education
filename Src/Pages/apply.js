import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Apply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    married: "",
    education: "",
    employmentType: "",
    applicantIncome: "",
    coapplicantIncome: "",
    loanAmount: "",
    loanTermMonths: "",
    creditHistory: "1",
    propertyValue: "",
    otherMonthlyDebt: "",
  });

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to apply for a loan",
          variant: "destructive",
        });
        navigate("/auth");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [navigate, toast]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // SUBMIT APPLICATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Insert application into database
      const { data: applicationData, error: insertError } = await supabase
        .from("loan_applications")
        .insert([
          {
            user_id: user.id,
            full_name: formData.fullName,
            gender: formData.gender,
            married: formData.married,
            education: formData.education,
            employment_type: formData.employmentType,
            applicant_income: parseFloat(formData.applicantIncome),
            coapplicant_income: parseFloat(formData.coapplicantIncome) || 0,
            loan_amount: parseFloat(formData.loanAmount),
            loan_term_months: parseInt(formData.loanTermMonths),
            credit_history: parseInt(formData.creditHistory),
            property_value: parseFloat(formData.propertyValue),
            other_monthly_debt: parseFloat(formData.otherMonthlyDebt) || 0,
            interest_rate: 8.0, // Starting interest rate
            status: "pending",
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Step 2: Call AI prediction edge function
      const { data: predictionData, error: predictionError } = await supabase.functions.invoke(
        "predict-loan",
        {
          body: {
            application_id: applicationData.id,
            gender: formData.gender,
            married: formData.married,
            education: formData.education,
            employment_type: formData.employmentType,
            applicant_income: parseFloat(formData.applicantIncome),
            coapplicant_income: parseFloat(formData.coapplicantIncome) || 0,
            loan_amount: parseFloat(formData.loanAmount),
            loan_term_months: parseInt(formData.loanTermMonths),
            credit_history: parseInt(formData.creditHistory),
            property_value: parseFloat(formData.propertyValue),
            other_monthly_debt: parseFloat(formData.otherMonthlyDebt) || 0,
          },
        }
      );

      if (predictionError) {
        console.error("Prediction error:", predictionError);
        throw new Error("Failed to process your application. Please try again.");
      }

      // Step 3: Show success message
      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully. You will receive a decision shortly.",
      });

      // Redirect to status page
      navigate("/status");

    } catch (error) {
      console.error("Application error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // RENDER THE FORM
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Education Loan Application</CardTitle>
            <CardDescription>Fill out the form below to apply for an education loan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* PERSONAL INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="married">Marital Status</Label>
                  <Select value={formData.married} onValueChange={(value) => handleChange("married", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Married</SelectItem>
                      <SelectItem value="No">Single</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select value={formData.education} onValueChange={(value) => handleChange("education", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Not Graduate">Not Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => handleChange("employmentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaried">Salaried</SelectItem>
                      <SelectItem value="Self-Employed">Self Employed</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* FINANCIAL INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financial Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantIncome">Your Monthly Income ($)</Label>
                    <Input
                      id="applicantIncome"
                      type="number"
                      value={formData.applicantIncome}
                      onChange={(e) => handleChange("applicantIncome", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coapplicantIncome">Co-applicant Income ($)</Label>
                    <Input
                      id="coapplicantIncome"
                      type="number"
                      value={formData.coapplicantIncome}
                      onChange={(e) => handleChange("coapplicantIncome", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleChange("loanAmount", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loanTermMonths">Loan Term (months)</Label>
                    <Input
                      id="loanTermMonths"
                      type="number"
                      value={formData.loanTermMonths}
                      onChange={(e) => handleChange("loanTermMonths", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyValue">Property Value ($)</Label>
                    <Input
                      id="propertyValue"
                      type="number"
                      value={formData.propertyValue}
                      onChange={(e) => handleChange("propertyValue", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otherMonthlyDebt">Other Monthly Debt ($)</Label>
                    <Input
                      id="otherMonthlyDebt"
                      type="number"
                      value={formData.otherMonthlyDebt}
                      onChange={(e) => handleChange("otherMonthlyDebt", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditHistory">Credit History</Label>
                  <Select value={formData.creditHistory} onValueChange={(value) => handleChange("creditHistory", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select credit history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Good</SelectItem>
                      <SelectItem value="0">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Apply;

