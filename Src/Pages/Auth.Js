import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State to store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // SIGNUP FUNCTION
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create user account in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
if (error) throw error;

      // Step 2: Save additional user info in profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,  // Link to auth user
              email: email,
              full_name: fullName,
              phone: phone,
            },
          ]);

        if (profileError) throw profileError;

        // Show success message
        toast({
          title: "Account created!",
          description: "You can now log in with your credentials.",
        });
      }
    } catch (error) {
      // Show error messagetoast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate user with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
if (error) throw error;

      // Show success message
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      // Redirect to home page
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }