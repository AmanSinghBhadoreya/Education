Education loan easily
5.4 Machine Learning Model
5.4.1 Model Architecture
The system uses Logistic Regression for binary classification (approve/reject).

Feature Engineering:

features = [
    'Gender',           # Encoded: Male=1, Female=0
    'Married',          # Encoded: Yes=1, No=0
    'Education',        # Graduate=1, Not Graduate=0
    'Self_Employed',    # Yes=1, No=0
    'ApplicantIncome',  # Numeric
    'CoapplicantIncome',# Numeric
    'LoanAmount',       # Numeric (in thousands)
    'Loan_Amount_Term', # Numeric (months)
    'Credit_History',   # 1=good, 0=poor
    'Property_Area',    # Urban=2, Semiurban=1, Rural=0
]

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
model = LogisticRegression(
    max_iter=1000,
    random_state=42,
    class_weight='balanced'
)
model.fit(X_train_scaled, y_train)

accuracy = model.score(X_test_scaled, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%"
  const { data: application } = await supabase
    .from("loan_applications")
    .select("*")
    .eq("id", applicationId)
    .single();
  
  const features = prepareFeatures(application)
  const prediction = predictLoanApproval(features);

  await supabase
    .from("loan_applications")
    .update({
      score: prediction.score,
      confidence: prediction.confidence,
      breakdown: prediction.breakdown
    })
    .eq("id", applicationId);
  
  return new Response(JSON.stringify(prediction), {
    headers: { "Content-Type": "application/json" }
  });
});
Prediction Logic:

function predictLoanApproval(features: any) {
 
  
  const weights = {
    income: 0.3,
    creditHistory: 0.4,
    loanAmount: -0.2,
    education: 0.1
  };
  
  let score = 0;
  score += (features.applicantIncome / 10000) * weights.income;
  score += features.creditHistory * weights.creditHistory;
  score += (features.loanAmount / 100000) * weights.loanAmount;
  score += features.education * weights.education;
  
 
  const normalizedScore = 1 / (1 + Math.exp(-score));
  
  return {
    score: normalizedScore,
    confidence: Math.abs(normalizedScore - 0.5) * 2,
    breakdown: {
      income_score: features.applicantIncome / 10000,
      credit_score: features.creditHistory,
      loan_ratio: features.loanAmount / features.applicantIncome
    }
  };
}
