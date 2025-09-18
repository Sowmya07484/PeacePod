"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginPageProps {
  onLogin: (details: {
    name: string;
    age: number;
    guardianEmail?: string;
    guardianPhone?: string;
    guardianOccupation?: string;
  }) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianOccupation, setGuardianOccupation] = useState('');
  const [error, setError] = useState('');

  const ageNumber = parseInt(age, 10);
  const isUnder18 = age && !isNaN(ageNumber) && ageNumber > 0 && ageNumber < 18;

  const handleLogin = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!age || isNaN(ageNumber) || ageNumber <= 0) {
      setError('Please enter a valid age.');
      return;
    }

    const loginDetails: Parameters<LoginPageProps['onLogin']>[0] = {
      name,
      age: ageNumber,
    };

    if (isUnder18) {
      if (!guardianEmail.trim() || !guardianEmail.includes('@')) {
        setError('Please enter a valid guardian email.');
        return;
      }
      if (!guardianPhone.trim()) {
        setError('Please enter a guardian phone number.');
        return;
      }
      if (!guardianOccupation.trim()) {
        setError('Please enter what your guardian does.');
        return;
      }
      loginDetails.guardianEmail = guardianEmail;
      loginDetails.guardianPhone = guardianPhone;
      loginDetails.guardianOccupation = guardianOccupation;
    }

    setError('');
    onLogin(loginDetails);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
              <path d="M12 18a6 6 0 0 0 6-6c0-1.5-.5-2.9-1.4-4" />
              <path d="M12 6a6 6 0 0 0-6 6c0 1.5.5 2.9 1.4 4" />
            </svg>
            <h1 className="font-headline text-2xl font-bold">ReflectWell</h1>
          </div>
          <CardTitle className="text-xl text-center">Welcome!</CardTitle>
          <CardDescription className="text-center">Please enter your details to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          {isUnder18 && (
            <>
              <div className="space-y-2 pt-2 border-t mt-4">
                 <Label htmlFor="guardianEmail">Guardian's Email</Label>
                 <Input id="guardianEmail" type="email" placeholder="Enter guardian's email" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian's Phone</Label>
                <Input id="guardianPhone" type="tel" placeholder="Enter guardian's phone number" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianOccupation">What does your guardian do?</Label>
                <Input id="guardianOccupation" placeholder="Enter guardian's occupation" value={guardianOccupation} onChange={(e) => setGuardianOccupation(e.target.value)} />
              </div>
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleLogin}>Continue</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
