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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-emerald-100 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
            >
              <path
                d="M16 2.66663C13.6811 2.66663 11.4638 3.33353 9.55585 4.58023C7.64791 5.82694 6.13071 7.59962 5.20417 9.6806C4.27763 11.7616 3.98822 14.0535 4.38171 16.2755C4.7752 18.4975 5.83158 20.5578 7.39341 22.1196C8.95523 23.6814 11.0155 24.7378 13.2375 25.1313C15.4595 25.5248 17.7514 25.2354 19.8324 24.3088C21.9134 23.3823 23.6861 21.8651 24.9328 19.9571C26.1795 18.0492 26.8464 15.8319 26.8464 13.513"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.2428 7.34668C21.7511 8.24231 22.9806 9.54452 23.8248 11.121C24.669 12.6975 25.1016 14.4849 25.0864 16.3005C25.0712 18.116 24.6087 19.8893 23.7439 21.4637C22.879 23.0381 21.6401 24.3639 20.1246 25.313"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.4839 12.25C14.151 11.8335 14.9213 11.5646 15.7339 11.4667C16.5464 11.3687 17.3712 11.4447 18.148 11.6882C18.9248 11.9317 19.6315 12.3368 20.2178 12.8727C20.8041 13.4086 21.2558 14.0601 21.5419 14.7833"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.1509 17.0333C10.818 16.6169 11.5883 16.348 12.4008 16.25C13.2133 16.152 14.0382 16.228 14.815 16.4715C15.5917 16.715 16.2985 17.1202 16.8848 17.656C17.4711 18.1919 17.9228 18.8434 18.2089 19.5666"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="font-headline text-2xl font-bold">PeacePod</h1>
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
