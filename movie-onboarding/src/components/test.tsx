'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, CheckCircle, X } from 'lucide-react';

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModalButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-105"
      >
        Open Sign Up Modal
      </button>

      <SignUpModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export const SignUpModal = ({ open, onOpenChange }: SignUpModalProps) => {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false);
            }
        };

        if (open) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
  }, [open, onOpenChange]);

  if (!open) return null;

  const benefits = [
      { icon: Briefcase, text: 'Flexible, part-time work' },
        { icon: MapPin, text: 'Local gigs near campus' },
        { icon: DollarSign, text: 'Fast payouts' },
        { icon: CheckCircle, text: 'No experience required' },
    ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-3 text-center text-black">
          Earn Money Helping Your Local Community
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Get matched with people near you who need help with tasks like moving, tutoring,
          pet sitting, and more. Set your schedule and get paid fast.
        </p>

        <div className="space-y-3 mb-6">
          {benefits.map(({ icon: Icon, text }, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 transition"
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-gray-800 font-medium">{text}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onOpenChange(false);
              router.push('/become-helper');
            }}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Sounds Good - Let Me Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
