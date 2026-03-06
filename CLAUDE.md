# JazzConnect - Project Context

## Overview
JazzConnect is a Next.js 14 app (App Router) connecting NYC jazz musicians with venues. Uses NextAuth for auth, Prisma + SQLite for data, Zod for validation, and Tailwind CSS for styling.

## Project Root
`C:\Users\pambi\projects\jazzconnect`

## Key Architecture
- **Framework**: Next.js 14.2.3 (App Router) with TypeScript
- **Auth**: NextAuth.js (`src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`)
- **Database**: Prisma + SQLite (`prisma/schema.prisma`)
- **Validation**: Zod schemas (`src/lib/validations.ts`)
- **Styling**: Tailwind CSS with custom `jazz-*` and `gold-*` color tokens
- **UI Components**: Custom component library at `src/components/ui/` (Button, Card, Input, Textarea, Select, MultiSelect, Modal, Badge, Avatar, etc.)
- **Constants**: Genre, instrument, and venue type lists at `src/lib/constants.ts`

## Data Models (Prisma)
- **User**: id, name, email, role ("musician"|"venue"), onboarded flag
- **MusicianProfile**: bio, instruments, genres, instagram, website, photoUrl, sampleTrackUrls, yearsExperience, available
- **VenueProfile**: name, description, address, lat/lng, venueType, capacity, photoUrls, website, phone
- **Gig**: venueId, title, description, date, startTime, endTime, genres, instruments, payMin/payMax, status
- **GigInterest / Invitation**: linking musicians to gigs with message + status

## Onboarding Wizard (Completed)
4-step wizard flow at `/onboarding`:
1. **Role Selection** - musician or venue (StepRoleSelection.tsx)
2. **Basic Info** - core profile fields with required indicators + char counts (StepBasicInfo.tsx)
3. **Social & Links** - instagram/website for musicians, website/phone for venues (StepSocialLinks.tsx)
4. **Review & Complete** - summary with edit links (StepReview.tsx)

### Onboarding Files
- `src/app/onboarding/page.tsx` - Wizard orchestrator with single useState<OnboardingFormData>
- `src/app/onboarding/types.ts` - OnboardingFormData interface + initialFormData
- `src/app/onboarding/schemas.ts` - Per-step Zod schemas (step1, step2Musician, step2Venue, step3Musician, step3Venue)
- `src/app/onboarding/components/ProgressIndicator.tsx` - Step dots with labels + connecting lines
- `src/app/onboarding/components/StepRoleSelection.tsx` - Role picker cards
- `src/app/onboarding/components/StepBasicInfo.tsx` - Core profile fields
- `src/app/onboarding/components/StepSocialLinks.tsx` - Optional social fields
- `src/app/onboarding/components/StepReview.tsx` - Summary with edit links + submit
- `src/lib/validations.ts` - Server-side discriminatedUnion schema
- `src/app/api/onboarding/route.ts` - API route passing all fields including social to Prisma

### UI Component Props Added
All UI components (Input, Textarea, Select, MultiSelect) now support `required` prop (renders red asterisk on label). MultiSelect also got an `error` prop for inline validation messages.

## Conventions
- Components use `forwardRef` pattern with `displayName`
- `cn()` utility from `src/lib/utils` for Tailwind class merging
- Server components by default, "use client" only when needed
- Error display pattern: `{error && <p className="text-sm text-red-600">{error}</p>}`
- Form fields use `id`, `label`, `error`, `placeholder` props consistently

## Commands
- `npm run dev` - Start dev server
- `npx prisma studio` - Database GUI
- `npx prisma db push` - Push schema changes
