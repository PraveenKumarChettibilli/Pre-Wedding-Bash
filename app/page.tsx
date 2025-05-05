'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Heart, MapPin, Calendar, Clock, Utensils, Shirt, CalendarPlus } from "lucide-react";
import Image from "next/image";

interface FormData {
  name: string;
  phone: string;
  attendance: string;
  guests: string;
  mealPreference: string;
  drinks: string[];
  notes: string;
}

// Calendar event details
const eventDetails = {
  title: "Vishal & Monica's Sangeet Ceremony",
  description: "Join us for an evening of music, dance, and celebration. Dress Code: Party Wear",
  location: "18331 Comus Rd, Dickerson, MD 20842",
  startTime: "2025-05-21T18:00:00-04:00", // EST timezone
  endTime: "2025-05-21T23:00:00-04:00", // Assuming 5 hours event
};

// Function to generate calendar URLs
const getCalendarUrls = () => {
  const encode = (str: string) => encodeURIComponent(str);
  
  // Google Calendar URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encode(eventDetails.title)}&dates=${eventDetails.startTime.replace(/[-:]/g, "").split(".")[0]}/${eventDetails.endTime.replace(/[-:]/g, "").split(".")[0]}&details=${encode(eventDetails.description)}&location=${encode(eventDetails.location)}`;
  
  // Apple Calendar URL (works on both iOS and macOS)
  const appleUrl = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR%0D%0AVERSION:2.0%0D%0APRODID:-//Vishal & Monica Wedding//EN%0D%0ACALSCALE:GREGORIAN%0D%0ABEGIN:VEVENT%0D%0ADTSTART:${eventDetails.startTime}%0D%0ADTEND:${eventDetails.endTime}%0D%0ASUMMARY:${encode(eventDetails.title)}%0D%0ADESCRIPTION:${encode(eventDetails.description)}%0D%0ALOCATION:${encode(eventDetails.location)}%0D%0AEND:VEVENT%0D%0AEND:VCALENDAR`;

  return {
    google: googleUrl,
    apple: appleUrl
  };
};

// Function to handle calendar button click
const handleCalendarClick = (type: 'google' | 'apple') => {
  const urls = getCalendarUrls();
  window.open(urls.google, '_blank');
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    attendance: '',
    guests: '',
    mealPreference: '',
    drinks: [],
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting || submitted) {
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!formData.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    if (!formData.attendance) {
      alert('Please select whether you will be attending');
      return;
    }

    if (formData.attendance === 'yes') {
      if (!formData.mealPreference) {
        alert('Please select your meal preference');
        return;
      }

      if (formData.drinks.length === 0) {
        alert('Please select at least one drink preference');
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace this URL with your new Google Apps Script Web App URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzKk7N5qU3pd9wE69R4k76L9Dil-S7Xkc2OzHadQZl2wqbEBvBAUl9CQwn9-uP-DCs/exec';
      
      const formDataToSend = {
        name: formData.name,
        phone: formData.phone,
        attendance: formData.attendance,
        guests: formData.guests,
        mealPreference: formData.mealPreference,
        drinks: formData.drinks.join(', '),
        notes: formData.notes
      };
      
      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(formDataToSend),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSubmitted(true);
      setShowConfetti(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrinkChange = (drink: string) => {
    setFormData(prev => {
      // If "No Drink" is selected, deselect all other options
      if (drink === 'No Drink') {
        if (prev.drinks.includes('No Drink')) {
          // If "No Drink" is being unchecked, just remove it
          return {
            ...prev,
            drinks: prev.drinks.filter(d => d !== 'No Drink')
          };
        } else {
          // If "No Drink" is being checked, remove all other selections
          return {
            ...prev,
            drinks: ['No Drink']
          };
        }
      }

      // If any other drink is selected, remove "No Drink" from the selection
      let newDrinks = prev.drinks.filter(d => d !== 'No Drink');
      
      if (prev.drinks.includes(drink)) {
        // Remove the drink if it's already selected
        newDrinks = newDrinks.filter(d => d !== drink);
      } else {
        // Add the drink if it's not selected
        newDrinks.push(drink);
      }

      return {
        ...prev,
        drinks: newDrinks
      };
    });
  };

  // Create confetti effect when form is submitted
  useEffect(() => {
    if (showConfetti) {
      const createConfetti = () => {
        const container = document.querySelector<HTMLDivElement>('.confetti-container');
        if (!container) return;
        
        const colors = ['#b76e79', '#d7bdb3', '#d4af37', '#ebcbc3', '#f2e4bb'];
        const shapes = ['circle', 'square', 'triangle'] as const;
        
        for (let i = 0; i < 100; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti-piece';
          
          // Random position
          confetti.style.left = `${Math.random() * 100}%`;
          
          // Random color
          const color = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.backgroundColor = color;
          
          // Random size
          const size = Math.random() * 8 + 4;
          confetti.style.width = `${size}px`;
          confetti.style.height = `${size}px`;
          
          // Random shape
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
          } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderLeft = `${size/2}px solid transparent`;
            confetti.style.borderRight = `${size/2}px solid transparent`;
            confetti.style.borderBottom = `${size}px solid ${color}`;
          }
          
          // Animation
          confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
          confetti.style.animationDelay = `${Math.random() * 2}s`;
          
          container.appendChild(confetti);
          
          // Remove confetti after animation
          setTimeout(() => {
            if (container.contains(confetti)) {
              container.removeChild(confetti);
            }
          }, 5000);
        }
      };
      
      createConfetti();
    }
  }, [showConfetti]);

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1628498188904-036f5e25e93e?q=80&w=2127')] bg-cover bg-center">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        
        .bg-gradient-party {
          background: linear-gradient(135deg, #1a237e, #0d47a1, #1565c0);
        }
        
        .bg-night-sky {
          position: relative;
          overflow: hidden;
        }
        
        .starry-night {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 4s ease-in-out infinite;
          opacity: 0.4;
        }
        
        .starry-night::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 10px 20px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 30px 50px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 60px 100px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 80px 30px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 120px 60px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 150px 100px, rgba(135, 206, 235, 0.8), rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 4s ease-in-out infinite reverse;
          opacity: 0.6;
        }
        
        @keyframes twinkle {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }
        
        .shooting-star {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .shooting-star::before {
          content: "";
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255,255,255,0.1),
                      0 0 0 8px rgba(255,255,255,0.1),
                      0 0 20px rgba(255,255,255,1);
          animation: shooting 3s linear infinite;
        }
        
        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100px) translateY(100px);
            opacity: 0;
          }
        }
        
        .text-gradient {
          background: linear-gradient(to right, #ffd700, #ffc107, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        
        .elegant-border {
          border-image: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 193, 7, 0.3), rgba(255, 215, 0, 0.3)) 1;
        }
        
        .corner-decoration {
          position: absolute;
          width: 100px;
          height: 100px;
          opacity: 0.2;
          z-index: 0;
        }
        
        @media (min-width: 768px) {
          .corner-decoration {
            width: 150px;
            height: 150px;
          }
        }
        
        .top-left {
          top: -20px;
          left: -20px;
          transform: rotate(180deg);
        }
        
        @media (min-width: 768px) {
          .top-left {
            top: -30px;
            left: -30px;
          }
        }
        
        .bottom-right {
          bottom: -20px;
          right: -20px;
        }
        
        @media (min-width: 768px) {
          .bottom-right {
            bottom: -30px;
            right: -30px;
          }
        }
        
        .party-lights {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          z-index: 0;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(255, 215, 0, 0.2) 0%, transparent 50%);
          animation: partyLights 8s ease-in-out infinite;
        }
        
        @keyframes partyLights {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.2;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 0.1;
          }
        }
        
        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 215, 0, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          z-index: 1;
          animation: shine 5s infinite;
        }
        
        @keyframes shine {
          0% {
            left: -100%;
          }
          20%, 100% {
            left: 100%;
          }
        }
        
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
        }
        
        .confetti-piece {
          position: absolute;
          top: -20px;
          z-index: 100;
          animation: fall linear forwards;
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .font-bodoni {
          font-family: 'Bodoni Moda', serif;
        }

        .font-bodoni-large {
          font-family: 'Bodoni Moda', serif;
          font-size: 2rem;
          letter-spacing: 1.5px;
          font-weight: 500;
        }

        .font-bodoni-medium {
          font-family: 'Bodoni Moda', serif;
          font-size: 1.1rem;
          letter-spacing: 0.75px;
          font-weight: 400;
        }

        .font-bodoni-small {
          font-family: 'Bodoni Moda', serif;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          font-weight: 400;
        }

        @media (min-width: 768px) {
          .font-bodoni-large {
            font-size: 3.5rem;
            letter-spacing: 2px;
          }

          .font-bodoni-medium {
            font-size: 1.5rem;
            letter-spacing: 1px;
          }

          .font-bodoni-small {
            font-size: 1.1rem;
            letter-spacing: 0.5px;
          }
        }

        .form-field {
          transition: all 0.3s ease-in-out;
          opacity: 1;
          max-height: 500px;
          overflow: hidden;
        }

        .form-field.hidden {
          opacity: 0;
          max-height: 0;
          margin: 0;
          padding: 0;
        }

        .calendar-button {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        @media (min-width: 768px) {
          .calendar-button {
            width: auto;
            padding: 1rem 2rem;
            font-size: 1.125rem;
            margin-top: 1rem;
          }
        }
      `}</style>

      <div className="min-h-screen bg-transparent py-6 px-4 sm:py-12 sm:px-4">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {/* Event Details */}
          <Card className="p-4 sm:p-8 bg-black/10 text-center relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1628498188904-036f5e25e93e?q=80&w=2127')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="starry-night"></div>
            <div className="shooting-star"></div>
            <div className="corner-decoration top-left" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="corner-decoration bottom-right" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="shine-effect"></div>
            <div className="relative z-10">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-[#ffd700] mx-auto mb-4 sm:mb-6" />
              <h1 className="font-bodoni-large mb-2 sm:mb-3 text-gradient">Vishal & Monica</h1>
              <p className="font-bodoni-medium text-[#ffd700] mb-6 sm:mb-8">Invite you to their Pre Wedding Bash</p>
              
              <div className="w-16 sm:w-24 h-px bg-gradient-party mx-auto mb-6 sm:mb-8"></div>
            
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#ffd700]" />
                  <h3 className="font-bodoni-small text-[#ffd700] uppercase tracking-wide">Date</h3>
                  <p className="font-bodoni-small text-[#ffd700]">Wednesday</p>
                  <p className="font-bodoni-small text-[#ffd700]">May 21st, 2025</p>
                </div>
                
                <div className="space-y-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#ffd700]" />
                  <h3 className="font-bodoni-small text-[#ffd700] uppercase tracking-wide">Time</h3>
                  <p className="font-bodoni-small text-[#ffd700]">6:00 PM EST</p>
                </div>
                
                <div className="space-y-2">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-[#ffd700]" />
                  <h3 className="font-bodoni-small text-[#ffd700] uppercase tracking-wide">Venue</h3>
                  <p className="font-bodoni-small text-[#ffd700]">18331 Comus Rd</p>
                  <p className="font-bodoni-small text-[#ffd700]">Dickerson, MD 20842</p>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#ffd700]/30">
                <Shirt className="w-6 h-7 sm:w-7 sm:h-9 mx-auto text-[#ffd700] mb-2" />
                <p className="font-bodoni-small text-[#ffd700]">Dress Code: Any Floral Dress</p>
              </div>
            </div>
          </Card>

          {/* RSVP Form */}
          <Card className="p-4 sm:p-8 bg-black/10 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1628498188904-036f5e25e93e?q=80&w=2127')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="starry-night"></div>
            <div className="shooting-star"></div>
            <div className="corner-decoration top-left" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="corner-decoration bottom-right" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="shine-effect"></div>
            <div className="relative z-10">
              <h2 className="font-bodoni-large text-center mb-4 sm:mb-6 text-gradient">Pre Wedding Bash RSVP</h2>
              <div className="w-16 sm:w-24 h-px bg-gradient-party mx-auto mb-6 sm:mb-8"></div>
              
              {submitted ? (
                <div className="text-center space-y-4">
                    <div className="text-5xl text-[#ffd700] mb-4">✓</div>
                    <h3 className="text-2xl text-[#ffd700] font-bodoni">Thank You!</h3>
                    <p className="text-[#ffd700] font-bodoni">We have received your RSVP.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-4">
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-[#ffd700] focus:border-[#ffc107] font-bodoni"
                    />
                    
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: value });
                      }}
                      required
                      className="border-[#ffd700] focus:border-[#ffc107] font-bodoni"
                    />
                  </div>

                  <Select
                    value={formData.attendance}
                    onValueChange={(value) => {
                      setFormData({ 
                        ...formData, 
                        attendance: value,
                        // Reset other fields when declining
                        ...(value === 'no' ? { 
                          guests: '', 
                          mealPreference: '', 
                          drinks: [],
                          notes: '' 
                        } : {})
                      });
                    }}
                    required
                  >
                    <SelectTrigger className="border-[#ffd700] focus:border-[#ffc107] font-bodoni">
                      <SelectValue placeholder="Will you attend the Party?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes" className="font-bodoni">Yes</SelectItem>
                      <SelectItem value="no" className="font-bodoni">No</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className={`form-field ${formData.attendance === 'no' ? 'hidden' : ''}`}>
                    <Input
                      type="number"
                      placeholder="Number of Guests Attending (Including You)"
                      min="1"
                      max="20"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      required={formData.attendance === 'yes'}
                      className="border-[#ffd700] focus:border-[#ffc107] font-bodoni"
                    />
                  </div>

                  <div className={`form-field ${formData.attendance === 'no' ? 'hidden' : ''}`}>
                    <label className="block text-sm font-bodoni text-[#ffd700] mb-2">Meal Preference (Required)</label>
                    <Select
                      value={formData.mealPreference}
                      onValueChange={(value) => setFormData({ ...formData, mealPreference: value })}
                      required={formData.attendance === 'yes'}
                    >
                      <SelectTrigger className="border-[#ffd700] focus:border-[#ffc107] font-bodoni">
                        <SelectValue placeholder="Select your meal preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian" className="font-bodoni">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian" className="font-bodoni">Non-Vegetarian</SelectItem>
                        <SelectItem value="pescatarian" className="font-bodoni">Pescatarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className={`form-field ${formData.attendance === 'no' ? 'hidden' : ''}`}>
                    <label className="block text-sm font-bodoni text-[#ffd700] mb-2">Preferred Drinks (Required)</label>
                    <div className="space-y-2">
                      {['Soft Drinks', 'Vodka', 'Whiskey', 'Beer', 'No Drink'].map((drink) => (
                        <div key={drink} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={drink}
                            checked={formData.drinks.includes(drink)}
                            onChange={() => handleDrinkChange(drink)}
                            className="h-4 w-4 text-[#ffd700] focus:ring-[#ffc107] border-[#ffd700] rounded"
                          />
                          <label htmlFor={drink} className="font-bodoni text-sm text-[#ffd700]">
                            {drink}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="Any additional notes (Song Requests, allergies, specific needs, etc.)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="resize-none border-[#ffd700] focus:border-[#ffc107] font-bodoni"
                    rows={4}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6 font-bodoni bg-gradient-party hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send RSVP'}
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>

        {/* Confetti container for celebration effect */}
        {showConfetti && <div className="confetti-container"></div>}
      </div>
    </main>
  );
}