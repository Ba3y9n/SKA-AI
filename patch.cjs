const fs = require('fs');
let content = fs.readFileSync('src/services/apiService.ts', 'utf8');

const replacement = `export async function submitAmbitionIdea(ambitionData: Partial<Ambition>): Promise<Ambition> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      id: 'local-' + Date.now(),
      text: ambitionData.text || '',
      name: ambitionData.name,
      role: ambitionData.role,
      department: ambitionData.department || '',
      major: ambitionData.major,
      created_at: new Date().toISOString(),
      status: 'approved',
      is_approved: true
    };
  }

  const payload: any = {
    text: ambitionData.text,
    name: ambitionData.name,
    role: ambitionData.role,
    department: ambitionData.department,
    major: ambitionData.major || null,
    status: 'approved',
    is_approved: true
  };

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert failed, attempting fallback payload:', error);
      const fallbackPayload = {
        text: ambitionData.text,
        department: ambitionData.department || (ambitionData.name ? \`\${ambitionData.name} - \${ambitionData.role}\` : ''),
        major: ambitionData.major || null,
        status: 'approved'
      };

      const retryResult = await supabase
        .from('ambitions')
        .insert([fallbackPayload])
        .select()
        .single();

      if (retryResult.error) {
        throw new Error('Supabase insert failed');
      }

      return retryResult.data as Ambition;
    }

    return data as Ambition;
  } catch (err: any) {
    console.error('Supabase submission exception:', err);
    throw new Error(err.message || 'Error occurred');
  }
}`;

content = content.replace(/export async function submitAmbitionIdea.*?(?=^export function subscribeToAmbitions)/ms, replacement + '\n\n');
fs.writeFileSync('src/services/apiService.ts', content);
