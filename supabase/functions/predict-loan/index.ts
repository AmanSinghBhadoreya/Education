import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// MAIN FUNCTION
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestData = await req.json();

    // Extract application data
    const {
      application_id,
      gender,
      married,
      education,
      employment_type,
      applicant_income,
      coapplicant_income,
      loan_amount,
      loan_term_months,
      credit_history,
      property_value,
      other_monthly_debt,
    } = requestData;

    console.log("Processing loan application:", application_id);
const totalIncome = applicant_income + (coapplicant_income || 0);

    // Calculate monthly loan payment (simplified formula)
    const monthlyRate = 0.08 / 12; // 8% annual rate
    const monthlyPayment =
      (loan_amount * monthlyRate * Math.pow(1 + monthlyRate, loan_term_months)) /
      (Math.pow(1 + monthlyRate, loan_term_months) - 1);

    // Calculate debt-to-income ratio
    const totalMonthlyDebt = monthlyPayment + (other_monthly_debt || 0);
    const debtToIncomeRatio = totalMonthlyDebt / totalIncome;
const loanToValueRatio = loan_amount / property_value;

    // ==========================================
    // SCORING FACTORS (each worth up to 1.0)
    // ==========================================

    let score = 0;
    const breakdown = {};

    // 1. CREDIT HISTORY (25% weight)
    const creditScore = credit_history === 1 ? 1.0 : 0.0;
    score += creditScore * 0.25;
    breakdown.creditHistory = {
      score: creditScore,
      weight: 0.25,
      contribution: creditScore * 0.25,
    };

    // 2. DEBT-TO-INCOME RATIO (30% weight)
    let dtiScore = 0;
    if (debtToIncomeRatio <= 0.28) {
      dtiScore = 1.0; // Excellent
    } else if (debtToIncomeRatio <= 0.36) {
      dtiScore = 0.8; // Good
    } else if (debtToIncomeRatio <= 0.43) {
      dtiScore = 0.6; // Fair
    } else if (debtToIncomeRatio <= 0.50) {
      dtiScore = 0.4; // Poor
    } else {
      dtiScore = 0.2; // Very poor
    }
        dtiS += dtiScore * 0.30;
    breakdown.debtToIncome = {
      ratio: debtToIncomeRatio,
      score: dtiScore,
      weight: 0.30,
      contribution: dtiScore * 0.30,
    };

    // 3. LOAN-TO-VALUE RATIO (20% weight)
    let ltvScore = 0;
    if (loanToValueRatio <= 0.80) {
      ltvScore = 1.0; // Excellent
    } else if (loanToValueRatio <= 0.90) {
      ltvScore = 0.7; // Good
    } else if (loanToValueRatio <= 0.95) {
      ltvScore = 0.5; // Fair
    } else {
      ltvScore = 0.3; // Risky
    }
    score += ltvScore * 0.20;
    breakdown.loanToValue = {
      ratio: loanToValueRatio,
      score: ltvScore,
      weight: 0.20,
      contribution: ltvScore * 0.20,
    };

    // 4. EDUCATION (10% weight)
    const educationScore = education === "Graduate" ? 1.0 : 0.7;
    score += educationScore * 0.10;
    breakdown.education = {
      level: education,
      score: educationScore,
      weight: 0.10,
      contribution: educationScore * 0.10,
    };

    // 5. EMPLOYMENT TYPE (10% weight)
    let employmentScore = 0;
    if (employment_type === "Salaried") {
      employmentScore = 1.0;
    } else if (employment_type === "Self-Employed") {
      employmentScore = 0.8;
    } else {
      employmentScore = 0.6;
    }
    score += employmentScore * 0.10;
    breakdown.employment = {
      type: employment_type,
      score: employmentScore,
      weight: 0.10,
      contribution: employmentScore * 0.10,
    };

    // 6. MARITAL STATUS (5% weight)
    const maritalScore = married === "Yes" ? 1.0 : 0.8;
    score += maritalScore * 0.05;
    breakdown.maritalStatus = {
      status: married,
      score: maritalScore,
      weight: 0.05,
      contribution: maritalScore * 0.05,
    };

    const finalScore = Math.min(Math.max(score, 0), 1);

    // Calculate confidence level
    const confidence = finalScore >= 0.7 ? 0.85 : finalScore >= 0.5 ? 0.70 : 0.60;

    // Determine decision
    let decision = "";
    if (finalScore >= 0.7) {
      decision = "Approved";
    } else if (finalScore >= 0.5) {
      decision = "Under Review";
    } else {
      decision = "Rejected";
    }

    console.log(`Application ${application_id} - Score: ${finalScore}, Decision: ${decision}`);

    // ==========================================
    // UPDATE DATABASE
    // ==========================================

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from("loan_applications")
      .update({
        score: finalScore,
        confidence: confidence,
        breakdown: breakdown,
        decision: decision,
        status: finalScore >= 0.7 ? "pending" : "rejected",
      })
      .eq("id", application_id);
if updateErrorror) {
      console.error("Error updating application:", updateError);
      throw updateError;
    }
return new Response(
      JSON.stringify({
        success: true,
        score: finalScore,
        confidence: confidence,
        decision: decision,
        breakdown: breakdown,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in predict-loan function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
