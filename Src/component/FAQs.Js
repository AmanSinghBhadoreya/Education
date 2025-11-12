import React, { useState } from "react";
import studentsGroup2 from "../assets/students-group-2.jpg";

const FAQ = () => {
  const faqs = [
    {
      question: "How quickly can I get education loan approval?",
      answer:
        "Most student applications receive a decision within 24 hours. Once approved, funds are disbursed within 2-3 days directly to the college or your account for informal loans.",
    },
    {
      question: "What's the difference between formal and informal loans?",
      answer:
        "Formal education loans are for tuition fees paid directly to educational institutions. Informal loans are for books, coaching, hostel, and urgent student expenses with flexible documentation.",
    },
    {
      question: "Do I need a guarantor or collateral?",
      answer:
        "For loans up to ₹7.5 lakhs, no collateral is required. Parent or guardian acts as co-applicant. For higher amounts, collateral may be needed. Informal loans under ₹2 lakhs need minimal documentation.",
    },
    {
      question: "When do I start repaying the loan?",
      answer:
        "We offer a grace period during your course plus 6 months after completion. You can choose to pay interest during studies or defer everything until you get a job. Very flexible for students!",
    },
    {
      question: "What documents do I need?",
      answer:
        "For formal loans: ID proof, admission letter, fee structure, parent's income proof, and bank statements. For informal loans: Student ID, course details, and basic family income proof. Quick processing for all applicants.",
    },
    {
      question: "Can I get a loan for coaching or competitive exam preparation?",
      answer:
        "Yes! Our informal loan option covers coaching fees for UPSC, GATE, CAT, medical entrance, and other competitive exams. Amounts up to ₹3 lakhs with flexible repayment terms.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ backgroundColor: "#f8f9fb", padding: "80px 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Left Side - Title + Image */}
          <div>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              style={{
                color: "#555",
                marginBottom: "30px",
              }}
            >
              Common questions about education loans and informal funding for
              Gwalior students
            </p>
            <img
              src={studentsGroup2}
              alt="Students at educational event"
              style={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          {/* Right Side - Accordion */}
          <div>
            {faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => toggleFAQ(index)}
                style={{
                  backgroundColor: "#fff",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "#111",
                    marginBottom: openIndex === index ? "10px" : "0",
                  }}
                >
                  {faq.question}
                </div>
                {openIndex === index && (
                  <div
                    style={{
                      color: "#555",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      marginTop: "6px",
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
