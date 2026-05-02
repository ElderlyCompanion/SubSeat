import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Pull admin-controlled FOMO phrases
    const { data: adminMetrics } = await supabase
      .from('live_activity_metrics')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    // Pull real booking counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      { count: bookingsToday },
      { count: bookingsWeek  },
      { count: newCustomers  },
      { count: newSubs       },
    ] = await Promise.all([
      supabase.from('bookings').select('*', { count:'exact', head:true }).gte('created_at', today.toISOString()),
      supabase.from('bookings').select('*', { count:'exact', head:true }).gte('created_at', weekAgo.toISOString()),
      supabase.from('profiles').select('*', { count:'exact', head:true }).gte('created_at', weekAgo.toISOString()),
      supabase.from('subscriptions').select('*', { count:'exact', head:true }).gte('created_at', monthStart.toISOString()),
    ]);

    // Build real-data metrics — only show if numbers are meaningful
    const realMetrics = [];

    if ((bookingsWeek || 0) >= 5) {
      realMetrics.push({
        key:  'weekly_bookings',
        text: `${bookingsWeek} booking requests this week`,
        type: 'real_data',
      });
    }

    if ((newCustomers || 0) >= 5) {
      realMetrics.push({
        key:  'new_customers',
        text: `${newCustomers} new customers joined this week`,
        type: 'real_data',
      });
    }

    if ((newSubs || 0) >= 3) {
      realMetrics.push({
        key:  'new_subscriptions',
        text: `${newSubs} new memberships started this month`,
        type: 'real_data',
      });
    }

    // Map admin-controlled phrases
    const adminPhrases = (adminMetrics || []).map(m => ({
      key:  m.metric_key,
      text: m.display_text,
      type: m.source_type,
    }));

    // Combine — real data first, then admin phrases
    const metrics = [...realMetrics, ...adminPhrases];

    // Fallback if nothing is available
    if (metrics.length === 0) {
      metrics.push({
        key:  'default',
        text: 'Early access now open across the UK',
        type: 'admin_controlled',
      });
    }

    return Response.json({
      metrics,
      updated_at: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Live metrics error:', err);
    return Response.json({
      metrics: [
        { key:'fallback', text:'Next 10 bookings get priority access', type:'admin_controlled' },
      ],
      updated_at: new Date().toISOString(),
    });
  }
}