// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const dto = await req.json()
    const genericEmail = `${dto.username.trim()}@interno.local`;

    // Crear cliente con la key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Creacion del usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: genericEmail,
      password: dto.password,
      email_confirm: true, 
      user_metadata: { username: dto.username.trim() }
    })

    if (authError) throw authError

    const today = new Date().toISOString()

    // creacion del usuario en la tabla user
    const { data: publicData, error: publicError } = await supabaseAdmin
      .from('user')
      .insert({
        id: authData.user.id,
        name: dto.name.trim(),
        surname: dto.surname.trim(),
        username: dto.username.trim().toLowerCase(),
        role: dto.role,
        is_active: true,
        created_at: today,
        updated_at: today
      })
      .select()
      .single()

    if (publicError) {
      // Rollback
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw publicError
    }

    return new Response(JSON.stringify(publicData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})