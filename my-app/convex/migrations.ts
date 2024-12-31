import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createFleetsFromCars = internalMutation({
  handler: async (ctx) => {
    // 1. Get all cars
    const cars = await ctx.db.query("cars").collect();

    // 2. Create a map to group cars by their unique combination
    const fleetMap = new Map<string, {
      model: string;
      maker: string;
      year: number;
      trim: string;
      registrationNumbers: string[];
    }>();

    // 3. Process each car
    cars.forEach(car => {
      // Create a unique key for each car model/maker/year/trim combination
      const key = `${car.maker}-${car.model}-${car.year}-${car.trim}`;

      if (fleetMap.has(key)) {
        // Add registration number to existing fleet
        const fleet = fleetMap.get(key)!;
        fleet.registrationNumbers.push(car.registrationNumber);
      } else {
        // Create new fleet entry
        fleetMap.set(key, {
          model: car.model,
          maker: car.maker,
          year: car.year,
          trim: car.trim,
          registrationNumbers: [car.registrationNumber],
        });
      }
    });

    // 4. Create fleet entries in the database
    for (const fleet of Array.from(fleetMap.values())) {
      // Check if fleet already exists
      const existingFleet = await ctx.db
        .query("fleets")
        .filter(q => 
          q.and(
            q.eq(q.field("maker"), fleet.maker),
            q.eq(q.field("model"), fleet.model),
            q.eq(q.field("year"), fleet.year),
            q.eq(q.field("trim"), fleet.trim)
          )
        )
        .first();

      if (!existingFleet) {
        // Create new fleet entry
        await ctx.db.insert("fleets", {
          model: fleet.model,
          maker: fleet.maker,
          year: fleet.year,
          trim: fleet.trim,
          registrationNumber: fleet.registrationNumbers,
          quantity: fleet.registrationNumbers.length,
        });
      }
    }

    return `Created ${fleetMap.size} fleet entries`;
  },
});

export const updateSettingsWithNotificationPreferences = internalMutation({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    
    const defaultPreferences = {
      booking: true,
      promotion: true,
      payment: true,
      rewards: true,
      reminder: true,
    };

    for (const setting of settings) {
      if (!setting.notificationPreferences) {
        await ctx.db.patch(setting._id, {
          notificationPreferences: defaultPreferences
        });
      }
    }

    return `Updated ${settings.length} settings records`;
  },
});
