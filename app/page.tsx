'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Heart, MapPin, Calendar, Clock, Utensils, Luggage } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    attendance: 'yes',
    guests: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Replace this URL with your Google Apps Script deployment URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyEMgws7zU9jBXFW_gRCCKP8m7QMVCZfFY-De4V4uxX1kR12RV2xc4-7exEGVnjS2cA/exec';
      
      // Format data as expected by Google Apps Script
      const formDataToSend = {
        name: formData.name,
        attendance: formData.attendance,
        guests: formData.guests,
        notes: formData.notes
      };
      
      const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // This is important for Google Apps Script
        body: JSON.stringify(formDataToSend),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Since we're using no-cors, we can't check response.ok
      // Instead, we'll assume success if no error is thrown
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your RSVP. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2940')] bg-cover bg-center">
      <div className="min-h-screen bg-black/50 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Invitation Image */}
          <Card className="p-2 bg-white/95 backdrop-blur overflow-hidden max-w-xl mx-auto">
            <div className="relative w-full" style={{ paddingTop: '141.4%' }}> {/* Aspect ratio for portrait (A4) */}
              <Image
                src="/WeddingCard.jpg"
                alt="Wedding Invitation"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
          </Card>

          {/* Wedding Details */}
          <Card className="p-8 bg-white/95 backdrop-blur text-center">
            <Heart className="w-12 h-12 text-pink-500 mx-auto mb-6" />
            <h1 className="text-4xl font-serif mb-3">Vishal & Monica</h1>
            <p className="text-xl text-muted-foreground mb-8">Request the pleasure of your company</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="space-y-2">
                <Calendar className="w-6 h-6 mx-auto text-pink-500" />
                <h3 className="font-semibold">Date</h3>
                <p className="text-muted-foreground">Friday</p>
                <p className="text-muted-foreground">May 23th, 2025</p>
              </div>
              
              <div className="space-y-2">
                <Clock className="w-6 h-6 mx-auto text-pink-500" />
                <h3 className="font-semibold">Time</h3>
                <p className="text-muted-foreground">Ceremony: 9:00 AM</p>
                {/* <p className="text-muted-foreground">Reception: 6:00 PM</p> */}
              </div>
              
              <div className="space-y-2">
                <MapPin className="w-6 h-6 mx-auto text-pink-500" />
                <h3 className="font-semibold">Venue</h3>
                <p className="text-muted-foreground">4143 Ayodhya Way</p>
                <p className="text-muted-foreground">Ijamsville, MD 21754</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <Luggage className="w-7 h-9 mx-auto text-pink-500 mb-2" />
              {/* <p className="text-muted-foreground">Dinner and dancing to follow</p> */}
              <p className="text-muted-foreground">Dress Code: Traditional Attire</p>
            </div>
          </Card>

          {/* RSVP Form */}
          <Card className="p-8 bg-white/95 backdrop-blur">
            <h2 className="text-3xl font-serif text-center mb-6">RSVP</h2>
            {submitted ? (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-serif">Thank You!</h3>
                <p className="text-muted-foreground">We have received your RSVP and look forward to celebrating with you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <Select
                  value={formData.attendance}
                  onValueChange={(value) => setFormData({ ...formData, attendance: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Will you attend?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Joyfully Accept</SelectItem>
                    <SelectItem value="no">Regretfully Decline</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="How many guests are attending? (including yourself)"
                  min="1"
                  max="5"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  required
                />

                <Textarea
                  placeholder="Any special notes?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="resize-none"
                  rows={4}
                />

                <Button type="submit" className="w-full text-lg py-6">
                  Send RSVP
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}