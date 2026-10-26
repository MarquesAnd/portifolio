/* Bilingual project content. Demo screens come from demos/<id>/screens.json (bundled into demos-manifest.js). */
window.PROJECTS = [
{
 id: 'cortex', name: 'CORTEX Neuro', repo: 'GestaoEquilibrium/cortex_app',
 kind: { en: 'Clinical assessment platform', pt: 'Plataforma de avaliação clínica' },
 desc: {
  en: "Runs neuropsychological assessments from intake to signed report. Clinicians apply tests, the platform scores them against normative tables, and reports follow Brazil's CFP 06/2019 standard. Scoring and reporting are separate, auditable steps.",
  pt: 'Conduz avaliações neuropsicológicas do cadastro ao laudo assinado. O profissional aplica os testes, a plataforma corrige com base nas tabelas normativas e os laudos seguem a Resolução CFP 06/2019. Correção e laudo são etapas separadas e auditáveis.' },
 facts: {
  en: ['60+ test-scoring modules (WAIS-III, WISC-IV, SRS-2, CARS-2, Vineland-3…)', 'Role-based access: admin, clinician, test administrator, intern, scorer', 'Immutable audit log for LGPD compliance'],
  pt: ['60+ módulos de correção (WAIS-III, WISC-IV, SRS-2, CARS-2, Vineland-3…)', 'Acesso por perfil: admin, clínico, aplicador, estagiário, corretor', 'Auditoria imutável para conformidade com a LGPD'] },
 stack: ['Supabase Postgres', 'Auth + RLS', 'Edge Functions', 'Storage', 'Vanilla JS', 'Tailwind', 'PWA'],
 access: { en: 'clinic staff', pt: 'à equipe da clínica' }
},
{
 id: 'aba', name: 'CORTEX ABA', repo: 'GestaoEquilibrium/cortex_aba',
 kind: { en: 'ABA therapy management', pt: 'Gestão de terapia ABA' },
 desc: {
  en: 'Day-to-day operations for an Applied Behavior Analysis clinic for autistic children. Therapists log trial-by-trial data in session, coordinators track program progress and attendance, and families follow along in their own portal.',
  pt: 'A operação diária de uma clínica de Análise do Comportamento Aplicada para crianças autistas. Terapeutas registram cada tentativa na sessão, a coordenação acompanha programas e presença, e as famílias acompanham pelo próprio portal.' },
 facts: {
  en: ['7 profiles, from clinic director to family', 'Trial-by-trial session data and program progress', 'Attendance, absences, supervision notes and digital consent forms'],
  pt: ['7 perfis, da direção à família', 'Registro tentativa a tentativa e evolução dos programas', 'Presença, faltas, supervisão, ATAs e termos digitais'] },
 stack: ['Supabase Postgres', 'Auth + RLS', 'Edge Functions', 'Storage', 'Vanilla JS', 'PWA'],
 access: { en: 'clinic staff and invited families', pt: 'à equipe e às famílias convidadas' }
},
{
 id: 'gestao', name: 'CORTEX Gestão', repo: 'GestaoEquilibrium/cortex_adm',
 kind: { en: 'Clinic back office', pt: 'Gestão administrativa da clínica' },
 desc: {
  en: 'The administrative system for both clinic units: team and HR records, a digital time clock with photo check-in, the org chart, room scheduling, vacations, projects and meetings. Every create, edit, view and download is audited.',
  pt: 'O sistema administrativo das duas unidades: equipe e RH, ponto digital com foto, organograma, agenda de salas, férias, projetos e reuniões. Cada criação, edição, visualização e download fica registrado na auditoria.' },
 facts: {
  en: ['Permissions by module and by tab', 'Digital time clock with timesheet mirror', 'Versioned SQL schema, 40+ migrations'],
  pt: ['Permissões por módulo e por aba', 'Ponto digital com espelho de ponto', 'Banco versionado com 40+ migrações SQL'] },
 stack: ['Supabase Postgres', 'Auth + RLS', 'Storage', 'React', 'SQL migrations'],
 access: { en: 'clinic staff', pt: 'à equipe da clínica' }
},
{
 id: 'contigo', name: 'Contigo', repo: 'GestaoEquilibrium/contigo_app',
 kind: { en: 'Workplace mental health (B2B)', pt: 'Saúde mental corporativa (B2B)' },
 desc: {
  en: "A mental health app companies offer their employees. People do a 20-second daily check-in, follow guided tracks and can reach a human when they need to. The employer only sees anonymized aggregates for Brazil's NR-1 risk program, and small groups are hidden.",
  pt: 'Um app de saúde mental que as empresas oferecem aos funcionários. A pessoa faz um check-in diário de 20 segundos, segue trilhas guiadas e fala com alguém quando precisa. A empresa só vê agregados anônimos para o programa de riscos da NR-1, e grupos pequenos ficam ocultos.' },
 facts: {
  en: ['Employee app + company portal on the same database', 'Invite-only onboarding with recorded consent', 'Row Level Security decides what each role can read'],
  pt: ['App do funcionário + portal da empresa no mesmo banco', 'Entrada só por convite, com consentimento registrado', 'A RLS decide o que cada perfil pode ler'] },
 stack: ['Supabase Postgres', 'Auth + RLS', 'React', 'TypeScript', 'Vite', 'Cloudflare Pages', 'PWA'],
 access: { en: 'employees invited by their company', pt: 'a funcionários convidados pela empresa' }
},
{
 id: 'marqs', name: 'MARQS Finance', repo: 'MarquesAnd/marqs_finance',
 kind: { en: 'Personal & couples finance PWA', pt: 'Finanças pessoais e do casal (PWA)' },
 desc: {
  en: 'An installable finance app for individuals and couples. Shared family accounts, credit cards with closing and due dates, monthly envelopes, goals, bulk import, and a settlement view that shows who owes whom.',
  pt: 'Um app de finanças instalável para quem mora sozinho ou a dois. Contas da família compartilhadas, cartões com fechamento e vencimento, envelopes do mês, metas, importação em lote e um acerto que mostra quem deve para quem.' },
 facts: {
  en: ['Family accounts shared between partners', 'Cash-basis logic for card purchases', 'Single-file PWA that works offline'],
  pt: ['Família compartilhada entre o casal', 'Regime de caixa nas compras no cartão', 'PWA em um único arquivo, funciona offline'] },
 stack: ['Supabase Postgres', 'Auth + RLS', 'Vanilla JS', 'PWA'],
 access: { en: 'invited family members', pt: 'aos membros convidados da família' }
}
];
