'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Heart, MapPin, Calendar, Clock, Utensils, Luggage, CalendarPlus } from "lucide-react";
import Image from "next/image";

interface FormData {
  name: string;
  attendance: string;
  guests: string;
  notes: string;
  phone: string;
}

// Calendar event details
const eventDetails = {
  title: "Vishal & Monica's Wedding Ceremony",
  description: "Join us for our special day. Dress Code: Traditional / Formal Attire",
  location: "4143 Ayodhya Way, Ijamsville, MD 21754",
  startTime: "2025-05-23T06:30:00-04:00", // EST timezone
  endTime: "2025-05-23T12:00:00-04:00", // Assuming 5.5 hours ceremony
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
    attendance: '',
    guests: '',
    notes: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbw02DVdnMgbC5mh3GgnaJ_yPPaopS5hm5s8jdmg7_4_qUJPw6XAcozx0ewmK6YCLIaT/exec';
      
      const formDataToSend = {
        name: formData.name,
        attendance: formData.attendance,
        guests: formData.guests,
        notes: formData.notes,
        phone: formData.phone
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
    }
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
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2940')] bg-cover bg-center">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        
        .bg-gradient-gold {
          background: linear-gradient(135deg, #b76e79, #d7bdb3, #d4af37);
        }
        
        .text-gradient {
          background: linear-gradient(to right, #b76e79, #d7bdb3, #d4af37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        
        .elegant-border {
          border-image: linear-gradient(135deg, rgba(183, 110, 121, 0.2), rgba(215, 189, 179, 0.2), rgba(212, 175, 55, 0.2)) 1;
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
        
        .floral-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          z-index: 0;
          animation: floralSpin 180s linear infinite;
        }
        
        @keyframes floralSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
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
            rgba(212, 175, 55, 0.1) 50%,
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

      <div className="min-h-screen bg-black/30 py-6 px-4 sm:py-12 sm:px-4">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {/* Invitation Image */}
          <Card className="p-2 bg-white/95 backdrop-blur overflow-hidden max-w-xl mx-auto elegant-border relative">
            <div className="shine-effect"></div>
            <div className="relative w-full" style={{ paddingTop: '141.4%' }}>
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
          <Card className="p-4 sm:p-8 bg-white/95 backdrop-blur text-center relative overflow-hidden">
            <div className="corner-decoration top-left" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNiNzZlNzkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="corner-decoration bottom-right" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkNGFmMzciIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="floral-pattern" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTIwLDIwQzQwLDQwLDYwLDQwLDgwLDIwQzYwLDQwLDYwLDYwLDgwLDgwQzYwLDYwLDQwLDYwLDIwLDgwQzQwLDYwLDQwLDQwLDIwLDIwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYjc2ZTc5IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxwYXRoIGQ9Ik01MCw1MEMzNSw2NSwyMCw1MCwyMCwzNUM1MCwzNSw1MCw1LDM1LDIwQzM1LDUwLDY1LDUwLDUwLDgwQzUwLDY1LDM1LDUwLDUwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkNGFmMzciIHN0cm9rZS13aWR0aD0iMC43NSIvPjwvc3ZnPg==')" }}></div>
            <div className="shine-effect"></div>
            <div className="relative z-10">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-rose-400 mx-auto mb-4 sm:mb-6" />
              <h1 className="font-bodoni-large mb-2 sm:mb-3 text-gradient">Vishal & Monica</h1>
              <p className="font-bodoni-medium text-muted-foreground mb-6 sm:mb-8">Joyfully invite you to their wedding ceremony</p>
              
              <div className="w-16 sm:w-24 h-px bg-gradient-gold mx-auto mb-6 sm:mb-8"></div>
            
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-rose-400" />
                  <h3 className="font-bodoni-small text-rose-400 uppercase tracking-wide">Date</h3>
                  <p className="font-bodoni-small text-muted-foreground">Friday</p>
                  <p className="font-bodoni-small text-muted-foreground">May 23rd, 2025</p>
                </div>
                
              <div className="space-y-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-rose-400" />
                  <h3 className="font-bodoni-small text-rose-400 uppercase tracking-wide">Time</h3>
                  <p className="font-bodoni-small text-muted-foreground">6:30 AM EST</p>
              </div>
              
              <div className="space-y-2">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-rose-400" />
                  <h3 className="font-bodoni-small text-rose-400 uppercase tracking-wide">Venue</h3>
                  <p className="font-bodoni-small text-muted-foreground">4143 Ayodhya Way</p>
                  <p className="font-bodoni-small text-muted-foreground">Ijamsville, MD 21754</p>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-rose-200">
                <Luggage className="w-6 h-7 sm:w-7 sm:h-9 mx-auto text-rose-400 mb-2" />
                <p className="font-bodoni-small text-muted-foreground">Dress Code: Traditional / Formal Attire</p>
              </div>
            </div>
          </Card>

          {/* RSVP Form */}
          <Card className="p-4 sm:p-8 bg-white/95 backdrop-blur relative overflow-hidden">
            <div className="corner-decoration top-left" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNiNzZlNzkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="corner-decoration bottom-right" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHBhdGggZD0iTTAsNTAgQzAsMjAgMjAsMCA1MCwwIEM3MCwwIDgwLDMwIDEwMCw1MCBDMTIwLDcwIDE1MCw4MCAxNTAsMTAwIEMxNTAsMTUwIDEwMCwyMDAgNTAsMTUwIEMzMCwxMzAgNTAsMTAwIDMwLDgwIEMxMCw2MCAyMCwyMCAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkNGFmMzciIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')" }}></div>
            <div className="floral-pattern" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTIwLDIwQzQwLDQwLDYwLDQwLDgwLDIwQzYwLDQwLDYwLDYwLDgwLDgwQzYwLDYwLDQwLDYwLDIwLDgwQzQwLDYwLDQwLDQwLDIwLDIwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYjc2ZTc5IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxwYXRoIGQ9Ik01MCw1MEMzNSw2NSwyMCw1MCwyMCwzNUM1MCwzNSw1MCw1LDM1LDIwQzM1LDUwLDY1LDUwLDUwLDgwQzUwLDY1LDM1LDUwLDUwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkNGFmMzciIHN0cm9rZS13aWR0aD0iMC43NSIvPjwvc3ZnPg==')" }}></div>
            <div className="shine-effect"></div>
            <div className="relative z-10">
              <h2 className="font-bodoni-large text-center mb-4 sm:mb-6 text-gradient">RSVP</h2>
              <div className="w-16 sm:w-24 h-px bg-gradient-gold mx-auto mb-6 sm:mb-8"></div>
              
            {submitted ? (
              <div className="text-center space-y-4">
                  <div className="text-5xl text-rose-400 mb-4">✓</div>
                  <h3 className="text-2xl font-bodoni">Thank You!</h3>
                  <p className="text-muted-foreground font-bodoni mb-6">We have received your RSVP.</p>
                  
                  {formData.attendance === 'yes' && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground font-bodoni mb-6">We look forward to celebrating with you.</p>
                      <p className="text-muted-foreground font-bodoni">Add this event to your calendar:</p>
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => handleCalendarClick('google')}
                          className="calendar-button font-bodoni bg-gradient-gold hover:opacity-90 flex items-center justify-center gap-2"
                        >
                          <CalendarPlus className="w-5 h-5" />
                          Add to Google Calendar
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-rose-200 focus:border-rose-300 font-bodoni"
                  />
                </div>

                <Select
                  value={formData.attendance}
                  onValueChange={(value) => {
                    setFormData({ 
                      ...formData, 
                      attendance: value,
                      // Reset guests count when declining
                      ...(value === 'no' ? { guests: '', phone: '' } : {})
                    });
                  }}
                  required
                >
                  <SelectTrigger className="border-rose-200 focus:border-rose-300 font-bodoni">
                    <SelectValue placeholder="Will you attend?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes" className="font-bodoni">Joyfully Accept</SelectItem>
                    <SelectItem value="no" className="font-bodoni">Regretfully Decline</SelectItem>
                  </SelectContent>
                </Select>

                <div className={`form-field ${formData.attendance === 'no' ? 'hidden' : ''}`}>
                  <Input
                    type="number"
                    placeholder="How many guests are attending? (including yourself)"
                    min="1"
                    max="5"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    required={formData.attendance === 'yes'}
                    className="border-rose-200 focus:border-rose-300 font-bodoni"
                  />
                </div>

                <div className={`form-field ${formData.attendance === 'no' ? 'hidden' : ''}`}>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: value });
                    }}
                    required={formData.attendance === 'yes'}
                    className="border-rose-200 focus:border-rose-300 font-bodoni"
                  />
                </div>

                <Textarea
                  placeholder="Any special notes?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="resize-none border-rose-200 focus:border-rose-300 font-bodoni"
                  rows={4}
                />

                  <Button 
                    type="submit" 
                    className="w-full text-lg py-6 font-bodoni bg-gradient-gold hover:opacity-90"
                  >
                  Send RSVP
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