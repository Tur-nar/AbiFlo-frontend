"use client";
import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pageVariants, pageTransition } from "./onboarding-animations";

const TIMEZONES = [
  "Africa/Lagos", "Africa/Cairo", "Africa/Johannesburg", "Africa/Nairobi",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Sao_Paulo", "America/Toronto", "Asia/Tokyo", "Asia/Shanghai",
  "Asia/Kolkata", "Asia/Dubai", "Australia/Sydney", "Europe/London",
  "Europe/Paris", "Europe/Berlin", "Europe/Moscow", "Pacific/Auckland",
];

interface StepProfileProps {
  direction: number;
  userName: string;
  avatarPreview: string | null;
  timezone: string;
  onAvatarSelect: (file: File) => void;
  onTimezoneChange: (tz: string) => void;
}

export function StepProfile({
  direction,
  userName,
  avatarPreview,
  timezone,
  onAvatarSelect,
  onTimezoneChange,
}: StepProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Max 5MB.");
        return;
      }
      onAvatarSelect(file);
    },
    [onAvatarSelect]
  );

  return (
    <motion.div
      key="step1"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={pageTransition}
      className="flex-1 flex flex-col p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif italic">
          Profile Setup
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Initialize your AbiFlo identity.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative lg:h-40 lg:w-40 h-32 w-32 rounded-2xl border-2 border-dashed border-border hover:border-brand/50 transition-colors flex items-center justify-center overflow-hidden bg-muted/30"
            aria-label="Upload avatar"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-7 w-7 text-muted-foreground group-hover:text-brand transition-colors" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </button>
        </div>

        {/* Name (read-only from session) */}
        <div className="space-y-2">
          <Label
            htmlFor="profile-name"
            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Full Name
          </Label>
          <Input
            id="profile-name"
            value={userName}
            readOnly
            className="bg-background/60 border-border text-sm cursor-default opacity-70"
          />
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label
            htmlFor="timezone-select"
            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Timezone
          </Label>
          <Select value={timezone} onValueChange={(val) => { if (val) onTimezoneChange(val); }}>
            <SelectTrigger
              id="timezone-select"
              className="w-full h-10 bg-background/60 border-border text-sm"
            >
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
