'use client'

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { OctagonAlertIcon, Code, Shield, Zap, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import z from 'zod';


const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password confirmation required" }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUpView: React.FC = () => {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message)
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message)
        },
      }
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center matrix-glow">
                <Code className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <User className="w-3 h-3 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold quantrix-gradient matrix-text-glow mb-3">
            Quantrix
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Create your account and meet your first AI companion
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Secure & Safe
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Email Verified
            </Badge>
          </div>
        </div>

        <Card className="matrix-card border-primary/30 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Form Fields */}
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Your Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            className="matrix-border bg-card/50 focus:bg-card/80 transition-all duration-300 h-12 text-base focus:ring-2 focus:ring-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Code className="w-4 h-4 text-primary" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            className="matrix-border bg-card/50 focus:bg-card/80 transition-all duration-300 h-12 text-base focus:ring-2 focus:ring-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••••••"
                              className="matrix-border bg-card/50 focus:bg-card/80 transition-all duration-300 h-12 text-base pr-12 focus:ring-2 focus:ring-primary/50"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-muted-foreground hover:text-primary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••••••••••"
                              className="matrix-border bg-card/50 focus:bg-card/80 transition-all duration-300 h-12 text-base pr-12 focus:ring-2 focus:ring-primary/50"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-muted-foreground hover:text-primary"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Error Alert */}
                {!!error && (
                  <Alert className="bg-destructive/10 border-destructive/30 matrix-border">
                    <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                    <AlertTitle className="text-destructive font-medium">Sign Up Failed</AlertTitle>
                    <p className="text-destructive/90 text-sm mt-1">{error}</p>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  disabled={pending}
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold matrix-glow transform hover:scale-[1.02] transition-all duration-300 h-14 text-lg"
                >
                  {pending ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Creating your account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5" />
                      <span>Create Account</span>
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card/80 px-4 text-muted-foreground font-medium tracking-wider">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    disabled={pending}
                    onClick={() => onSocial("google")}
                    variant="outline"
                    type="button"
                    className="border-primary/30 text-primary hover:bg-primary/10 h-12 group transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <FaGoogle className="w-5 h-5 group-hover:text-primary transition-colors" />
                  </Button>
                  <Button
                    disabled={pending}
                    onClick={() => onSocial("github")}
                    variant="outline"
                    type="button"
                    className="border-primary/30 text-primary hover:bg-primary/10 h-12 group transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <FaGithub className="w-5 h-5 group-hover:text-primary transition-colors" />
                  </Button>
                </div>

                {/* Links */}
                <div className="text-center space-y-3 pt-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link 
                      href="/sign-in" 
                      className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground mt-8 space-y-2">
          <p>Protected by industry-standard encryption</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-primary/70 hover:text-primary underline underline-offset-4 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-primary/70 hover:text-primary underline underline-offset-4 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpView;
