import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.invitation.deleteMany();
  await prisma.gigInterest.deleteMany();
  await prisma.gig.deleteMany();
  await prisma.musicianProfile.deleteMany();
  await prisma.venueProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create musician users
  const musicianUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Miles Davis Jr.",
        email: "miles@example.com",
        role: "musician",
        onboarded: true,
        musicianProfile: {
          create: {
            bio: "Trumpet player inspired by the legends. 15 years performing in NYC jazz clubs. Comfortable with standards, originals, and improvisation.",
            instruments: "Trumpet, Flugelhorn",
            genres: "Bebop, Hard Bop, Modal Jazz",
            instagram: "@milesdavisjr",
            website: "",
            yearsExperience: 15,
            available: true,
          },
        },
      },
      include: { musicianProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Keys",
        email: "sarah@example.com",
        role: "musician",
        onboarded: true,
        musicianProfile: {
          create: {
            bio: "Pianist and composer blending traditional jazz with contemporary influences. Graduate of Manhattan School of Music.",
            instruments: "Piano, Organ",
            genres: "Contemporary, Fusion, Smooth Jazz",
            instagram: "@sarahkeysnyc",
            website: "",
            yearsExperience: 8,
            available: true,
          },
        },
      },
      include: { musicianProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "Tommy Rhythm",
        email: "tommy@example.com",
        role: "musician",
        onboarded: true,
        musicianProfile: {
          create: {
            bio: "Drummer with deep roots in swing and bebop. Available for regular weekly gigs.",
            instruments: "Drums",
            genres: "Swing, Bebop, Latin Jazz",
            instagram: "@tommyrhythm",
            website: "",
            yearsExperience: 20,
            available: true,
          },
        },
      },
      include: { musicianProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "Elena Strings",
        email: "elena@example.com",
        role: "musician",
        onboarded: true,
        musicianProfile: {
          create: {
            bio: "Bass player who can hold down any groove. Jazz, funk, Latin — you name it.",
            instruments: "Bass, Guitar",
            genres: "Fusion, Latin Jazz, Acid Jazz",
            instagram: "@elenastrings",
            website: "",
            yearsExperience: 12,
            available: true,
          },
        },
      },
      include: { musicianProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "Dizzy Clarke",
        email: "dizzy@example.com",
        role: "musician",
        onboarded: true,
        musicianProfile: {
          create: {
            bio: "Saxophonist specializing in alto and tenor. Loves sitting in at late-night sessions.",
            instruments: "Saxophone, Clarinet",
            genres: "Bebop, Cool Jazz, Free Jazz",
            instagram: "@dizzyclarke",
            website: "",
            yearsExperience: 10,
            available: false,
          },
        },
      },
      include: { musicianProfile: true },
    }),
  ]);

  // Create venue users
  const venueUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Blue Note Manager",
        email: "bluenote@example.com",
        role: "venue",
        onboarded: true,
        venueProfile: {
          create: {
            name: "The Blue Note",
            description: "Legendary jazz club in the heart of Greenwich Village. Intimate setting with world-class acoustics.",
            address: "131 W 3rd St, New York, NY 10012",
            venueType: "Club",
            capacity: 150,
            phone: "(212) 475-8592",
          },
        },
      },
      include: { venueProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "Vanguard Host",
        email: "vanguard@example.com",
        role: "venue",
        onboarded: true,
        venueProfile: {
          create: {
            name: "Village Vanguard",
            description: "Since 1935, the gold standard for jazz. A basement club with unparalleled atmosphere.",
            address: "178 7th Ave S, New York, NY 10014",
            venueType: "Club",
            capacity: 123,
            phone: "(212) 255-4037",
          },
        },
      },
      include: { venueProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "Harlem Lounge Owner",
        email: "harlem@example.com",
        role: "venue",
        onboarded: true,
        venueProfile: {
          create: {
            name: "Minton's Playhouse",
            description: "The birthplace of bebop, revived. Great food, great music, great vibes in Harlem.",
            address: "206 W 118th St, New York, NY 10026",
            venueType: "Restaurant",
            capacity: 80,
          },
        },
      },
      include: { venueProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "SoHo Wine Bar",
        email: "soho@example.com",
        role: "venue",
        onboarded: true,
        venueProfile: {
          create: {
            name: "Jazz & Grapes",
            description: "Upscale wine bar featuring nightly jazz performances. Perfect for duo and trio sets.",
            address: "85 Spring St, New York, NY 10012",
            venueType: "Wine Bar",
            capacity: 45,
          },
        },
      },
      include: { venueProfile: true },
    }),
  ]);

  // Create gigs
  const now = new Date();
  const gigs = await Promise.all([
    prisma.gig.create({
      data: {
        venueId: venueUsers[0].venueProfile!.id,
        title: "Friday Night Jazz Trio",
        description: "Looking for a piano trio (piano, bass, drums) for our regular Friday night slot. Standards and originals welcome.",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        startTime: "20:00",
        endTime: "23:00",
        genres: "Bebop, Hard Bop",
        instruments: "Piano, Bass, Drums",
        payMin: 200,
        payMax: 300,
        status: "open",
      },
    }),
    prisma.gig.create({
      data: {
        venueId: venueUsers[0].venueProfile!.id,
        title: "Saturday Latin Jazz Night",
        description: "High-energy Latin jazz set. Need strong rhythm section and a horn player.",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
        startTime: "21:00",
        endTime: "00:00",
        genres: "Latin Jazz, Fusion",
        instruments: "Trumpet, Saxophone, Bass, Drums",
        payMin: 250,
        payMax: 350,
        status: "open",
      },
    }),
    prisma.gig.create({
      data: {
        venueId: venueUsers[1].venueProfile!.id,
        title: "Monday Night Residency",
        description: "Weekly Monday night residency. Looking for a quartet with a strong leader.",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6),
        startTime: "19:30",
        endTime: "22:30",
        genres: "Bebop, Cool Jazz, Modal Jazz",
        instruments: "Saxophone, Piano, Bass, Drums",
        payMin: 300,
        payMax: 400,
        status: "open",
      },
    }),
    prisma.gig.create({
      data: {
        venueId: venueUsers[2].venueProfile!.id,
        title: "Sunday Brunch Jazz",
        description: "Relaxed Sunday brunch set. Smooth jazz and standards. Great food, great crowd.",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8),
        startTime: "11:00",
        endTime: "14:00",
        genres: "Smooth Jazz, Swing",
        instruments: "Guitar, Vocals, Piano",
        payMin: 150,
        payMax: 200,
        status: "open",
      },
    }),
    prisma.gig.create({
      data: {
        venueId: venueUsers[3].venueProfile!.id,
        title: "Wine & Jazz Duo",
        description: "Intimate duo setting for our wine tasting event. Piano/guitar + bass or vocals preferred.",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
        startTime: "18:00",
        endTime: "21:00",
        genres: "Cool Jazz, Contemporary",
        instruments: "Piano, Guitar, Vocals",
        payMin: 175,
        payMax: 225,
        status: "open",
      },
    }),
  ]);

  // Create some interests
  await prisma.gigInterest.create({
    data: {
      gigId: gigs[0].id,
      musicianId: musicianUsers[1].musicianProfile!.id, // Sarah Keys - pianist
      message: "I'd love to lead a trio for this! I have a great setlist of standards.",
      status: "pending",
    },
  });

  await prisma.gigInterest.create({
    data: {
      gigId: gigs[0].id,
      musicianId: musicianUsers[2].musicianProfile!.id, // Tommy Rhythm - drummer
      message: "Available and ready to swing!",
      status: "pending",
    },
  });

  await prisma.gigInterest.create({
    data: {
      gigId: gigs[1].id,
      musicianId: musicianUsers[0].musicianProfile!.id, // Miles - trumpet
      message: "Latin jazz is my specialty. Count me in!",
      status: "accepted",
    },
  });

  await prisma.gigInterest.create({
    data: {
      gigId: gigs[2].id,
      musicianId: musicianUsers[4].musicianProfile!.id, // Dizzy - sax
      message: "Would love to lead a quartet here.",
      status: "pending",
    },
  });

  // Create some invitations
  await prisma.invitation.create({
    data: {
      gigId: gigs[3].id,
      musicianId: musicianUsers[1].musicianProfile!.id, // Sarah Keys
      message: "We'd love to have you for our brunch set!",
      status: "pending",
    },
  });

  await prisma.invitation.create({
    data: {
      gigId: gigs[4].id,
      musicianId: musicianUsers[3].musicianProfile!.id, // Elena Strings
      message: "Your bass would be perfect for our intimate wine bar setting.",
      status: "accepted",
    },
  });

  console.log("Seeding complete!");
  console.log(`Created ${musicianUsers.length} musicians`);
  console.log(`Created ${venueUsers.length} venues`);
  console.log(`Created ${gigs.length} gigs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
