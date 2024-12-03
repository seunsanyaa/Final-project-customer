import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Define a staff member type
interface StaffMember {
  role: string;
  email: string;
}

// Query to get all staff members
export const getAllStaff = query({
  handler: async (ctx) => {
    return await ctx.db.query("staff").collect();
  },
});

// Mutation to add a new staff member
export const addStaffMember = mutation({
  args: {
    role: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const newStaffMember: StaffMember = {
      role: args.role,
      email: args.email,
    };
    return await ctx.db.insert("staff", newStaffMember);
  },
});

// Query to get a staff member by ID
export const getStaffMemberById = query({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation to update a staff member
export const updateStaffMember = mutation({
  args: {
    id: v.id("staff"),
    role: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Mutation to delete a staff member
export const deleteStaffMember = mutation({
  args: { id: v.id("staff") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Add this new query
export const getStaffByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const staff = await ctx.db
      .query("staff")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return staff;
  },
});