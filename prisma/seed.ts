import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create sample events for the reunion
  const today = new Date();
  const day1 = new Date(today);
  day1.setHours(0, 0, 0, 0);

  const day2 = new Date(day1);
  day2.setDate(day2.getDate() + 1);

  const day3 = new Date(day1);
  day3.setDate(day3.getDate() + 2);

  await prisma.event.createMany({
    data: [
      // Day 1
      {
        title: "Welcome Breakfast",
        description: "Kick off the reunion with a big family breakfast. Pancakes, eggs, bacon, and lots of catching up!",
        location: "Main Lodge - Dining Hall",
        category: "meal",
        date: day1,
        startTime: "08:00",
        endTime: "09:30",
      },
      {
        title: "Family Kickball Tournament",
        description: "Teams of 6. Bracket-style elimination. Bragging rights for a year!",
        location: "South Field",
        category: "game",
        date: day1,
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        title: "BBQ Lunch",
        description: "Burgers, hot dogs, ribs, and all the fixings. Vegetarian options available.",
        location: "Picnic Area",
        category: "meal",
        date: day1,
        startTime: "12:30",
        endTime: "14:00",
      },
      {
        title: "Lake Swimming & Free Time",
        description: "Take a dip, kayak, or just relax by the water.",
        location: "Lake Beach",
        category: "free-time",
        date: day1,
        startTime: "14:00",
        endTime: "17:00",
      },
      {
        title: "Family Talent Show",
        description: "Show off your hidden talents! Singing, dancing, comedy — anything goes.",
        location: "Amphitheater",
        category: "ceremony",
        date: day1,
        startTime: "19:00",
        endTime: "21:00",
      },
      // Day 2
      {
        title: "Morning Yoga",
        description: "Start the day right with a gentle family yoga session. All levels welcome.",
        location: "Meadow",
        category: "outing",
        date: day2,
        startTime: "07:00",
        endTime: "08:00",
      },
      {
        title: "Pancake Breakfast",
        description: "Grandma's secret recipe pancakes!",
        location: "Main Lodge - Dining Hall",
        category: "meal",
        date: day2,
        startTime: "08:30",
        endTime: "09:30",
      },
      {
        title: "Scavenger Hunt",
        description: "Teams explore the grounds solving clues. Prizes for the top 3 teams!",
        location: "Starting at Main Lodge",
        category: "game",
        date: day2,
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        title: "Cook-Off Challenge",
        description: "Who makes the best chili? Sign up to compete or come to taste and vote!",
        location: "Outdoor Kitchen",
        category: "game",
        date: day2,
        startTime: "14:00",
        endTime: "16:00",
      },
      {
        title: "Family Dinner & Awards",
        description: "Sit-down dinner followed by awards for all the competitions.",
        location: "Main Lodge - Dining Hall",
        category: "ceremony",
        date: day2,
        startTime: "18:00",
        endTime: "21:00",
      },
      // Day 3
      {
        title: "Farewell Brunch",
        description: "Last meal together. Share favorite memories from the weekend!",
        location: "Main Lodge - Dining Hall",
        category: "meal",
        date: day3,
        startTime: "09:00",
        endTime: "11:00",
      },
      {
        title: "Family Photo Session",
        description: "Professional photographer for family portraits and group shots.",
        location: "Garden",
        category: "ceremony",
        date: day3,
        startTime: "11:00",
        endTime: "12:30",
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
