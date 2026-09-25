document.addEventListener('DOMContentLoaded', async () => {

    const SUPABASE_URL = 'https://avtxzwmvhygnrsogulbr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_L0f6pyFEmiJRKWn7w2qHOg_wl47Amtc';

    if (!window.supabase) {
        console.error('Libreria Supabase non trovata!');
        return;
    }

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
        console.warn('Utente non autenticato, reindirizzamento al login...');
        window.location.href = '/login.html';
        return;
    }

    console.log('Dati utente loggato:', user);

    const infoNome = document.getElementById('infoNome');
    const infoCognome = document.getElementById('infoCognome');
    const infoEmail = document.getElementById('infoEmail');

    if (infoEmail) infoEmail.textContent = user.email || '-';
    if (infoNome) infoNome.textContent = user.user_metadata?.nome || '-';
    if (infoCognome) infoCognome.textContent = user.user_metadata?.cognome || '-';

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Esecuzione del logout...');
            
            btnLogout.disabled = true;
            btnLogout.textContent = 'Disconnessione...';

            try {
                await supabase.auth.signOut();
                console.log('Logout completato!');
                window.location.href = '/login.html';
            } catch (err) {
                console.error('Errore durante il logout:', err);
                window.location.href = '/login.html';
            }
        });
    }
});