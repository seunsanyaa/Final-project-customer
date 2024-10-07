import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getUserId } from './util';

// Get a single analytical report by reportId
export const getAnalyticalReport = query({
  args: { reportId: v.string() },
  handler: async (ctx, args) => {
    const report = await ctx.db
      .query('analyticalreport')
      .withIndex('by_reportId', (q) => q.eq('reportId', args.reportId))
      .first();

    if (!report) {
      throw new Error('Analytical report not found');
    }

    return report;
  },
});

// Get all analytical reports
export const getAllAnalyticalReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('analyticalreport').collect();
  },
});

// Create a new analytical report
export const createAnalyticalReport = mutation({
  args: {
    reportId: v.string(),
    reportDate: v.string(),
    reportTitle: v.string(),
    reportContent: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const reportId = await ctx.db.insert('analyticalreport', {
      ...args,
    });

    return reportId;
  },
});

// Update an existing analytical report
export const updateAnalyticalReport = mutation({
  args: {
    reportId: v.string(),
    reportDate: v.optional(v.string()),
    reportTitle: v.optional(v.string()),
    reportContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const { reportId, ...updateFields } = args;
    const existingReport = await ctx.db
      .query('analyticalreport')
      .withIndex('by_reportId', (q) => q.eq('reportId', reportId))
      .first();

    if (!existingReport) {
      throw new Error('Analytical report not found');
    }

    await ctx.db.patch(existingReport._id, updateFields);
    return existingReport._id;
  },
});

// Delete an analytical report
export const deleteAnalyticalReport = mutation({
  args: { reportId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    const reportToDelete = await ctx.db
      .query('analyticalreport')
      .withIndex('by_reportId', (q) => q.eq('reportId', args.reportId))
      .first();

    if (!reportToDelete) {
      throw new Error('Analytical report not found');
    }

    await ctx.db.delete(reportToDelete._id);
  },
});

// Search analytical reports by title
export const searchAnalyticalReports = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('analyticalreport')
      .filter((q) => q.eq(q.field('reportTitle'), args.searchTerm))
      .collect();
  },
});

// Get analytical reports by date range
export const getAnalyticalReportsByDateRange = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('analyticalreport')
      .filter((q) => 
        q.and(
          q.gte(q.field('reportDate'), args.startDate),
          q.lte(q.field('reportDate'), args.endDate)
        )
      )
      .collect();
  },
});