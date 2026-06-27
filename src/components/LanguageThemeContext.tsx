import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, Language, UserProfile } from '../types';

interface LanguageThemeContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const LanguageThemeContext = createContext<LanguageThemeContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // General
    'app.name': 'Projeto Alpha Premium',
    'app.slogan': 'Sua evolução começa agora.',
    'app.cta': 'COMEÇAR AGORA',
    'app.subscribe': 'ASSINAR AGORA',
    'app.premium': 'Premium',
    'app.back': 'Voltar',
    'app.save': 'Salvar',
    'app.cancel': 'Cancelar',
    'app.success': 'Sucesso',
    'app.error': 'Erro',
    'app.edit': 'Editar',
    'app.loading': 'Carregando...',
    'app.logout': 'Sair',

    // Landing Page
    'lp.headline': 'Transforme seu corpo com estratégia, tecnologia e acompanhamento completo.',
    'lp.subheadline': 'Projeto Alpha Premium: O sistema definitivo de ganho de massa muscular, acompanhamento físico, dietas personalizadas e hábitos de alta performance para quem busca resultados reais.',
    'lp.price': 'R$ 17,90 por mês',
    'lp.terms': 'Sem teste grátis • Sem fidelidade • Pagamento seguro',
    'lp.benefits': 'Benefícios Exclusivos',
    'lp.benefits.sub': 'Tudo o que você precisa para alcançar o shape dos seus sonhos de forma inteligente e científica.',
    'lp.benefit.1.title': 'Treinos Periodizados',
    'lp.benefit.1.desc': 'Acesso a rotinas otimizadas de hipertrofia (ABC, ABCD, Push Pull Legs) desenhadas por especialistas.',
    'lp.benefit.2.title': 'Nutrição Científica',
    'lp.benefit.2.desc': 'Calcule seus macronutrientes específicos para ganho de massa de acordo com sua TMB e peso.',
    'lp.benefit.3.title': 'Gráficos de Evolução',
    'lp.benefit.3.desc': 'Acompanhe visualmente a variação de peso, IMC, percentual de gordura e todas as medidas corporais.',
    'lp.benefit.4.title': 'Monitor de Hábitos',
    'lp.benefit.4.desc': 'Registre sua ingestão de água, qualidade do sono, humor, estresse e suplementação diariamente.',
    'lp.how': 'Como Funciona?',
    'lp.how.1': '1. Crie seu Perfil',
    'lp.how.1.desc': 'Informe suas medidas, nível atual de treino e objetivos específicos.',
    'lp.how.2': '2. Receba Estratégias',
    'lp.how.2.desc': 'A plataforma calcula seus macros ideais e disponibiliza periodizações de treino.',
    'lp.how.3': '3. Monitore os Hábitos',
    'lp.how.3.desc': 'Insira suas refeições, treinos diários e qualidade do sono para ganhar XP.',
    'lp.how.4': '4. Evolua com Gráficos',
    'lp.how.4.desc': 'Faça avaliações físicas semanais e acompanhe sua evolução física com gráficos interativos.',
    'lp.premium.resources': 'Recursos Premium',
    'lp.demo.title': 'Demonstração da Plataforma',
    'lp.demo.desc': 'Veja uma prévia interativa do painel premium que otimizará seus resultados diários.',
    'lp.comp.title': 'Por que escolher o Projeto Alpha?',
    'lp.comp.desc': 'Veja a diferença entre continuar no básico e alcançar o patamar Alpha Premium.',
    'lp.faq.title': 'Perguntas Frequentes (FAQ)',
    'lp.faq.1.q': 'Como funciona a cobrança de R$ 17,90?',
    'lp.faq.1.a': 'É uma assinatura recorrente mensal via Stripe. Você pode cancelar a qualquer momento sem custos adicionais ou fidelidade.',
    'lp.faq.2.q': 'Posso alterar meus objetivos após o cadastro?',
    'lp.faq.2.a': 'Sim, a qualquer momento no seu Perfil você pode alterar peso, altura ou objetivo e os cálculos de macronutrientes serão atualizados automaticamente.',
    'lp.faq.3.q': 'Os treinos servem para iniciantes?',
    'lp.faq.3.a': 'Sim, temos rotinas do Iniciante ao Avançado, além de periodizações clássicas como ABCDE e Push-Pull-Legs.',

    // Onboarding
    'on.title': 'Seu Onboarding Personalizado',
    'on.step1.title': 'Treinos Inteligentes',
    'on.step1.desc': 'Periodizações completas adaptadas ao seu nível atual (Iniciante, Intermediário e Avançado) com cargas e descansos regulados.',
    'on.step2.title': 'Dietas Personalizadas',
    'on.step2.desc': 'Cálculo instantâneo de Taxa Metabólica Basal (TMB), Gasto Calórico Diário (TDEE) e superávit focado em hipertrofia.',
    'on.step3.title': 'Avaliações Semanais',
    'on.step3.desc': 'Acompanhe as variações de perímetros musculares (braços, peito, cintura) e percentual de gordura.',
    'on.step4.title': 'Evolução Física Estável',
    'on.step4.desc': 'Suba fotos (frente, costas, lateral) e veja seu progresso em painéis de gráficos premium.',
    'on.step5.title': 'Controle de Hábitos',
    'on.step5.desc': 'Controle de sono, água, estresse e exposição ao sol para elevar sua performance física diária.',

    // Auth
    'auth.login.title': 'Entrar no Alpha Premium',
    'auth.register.title': 'Criar Conta Premium',
    'auth.forgot.title': 'Recuperar Senha',
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.firstName': 'Nome',
    'auth.lastName': 'Sobrenome',
    'auth.sex': 'Sexo',
    'auth.age': 'Idade',
    'auth.weight': 'Peso Atual (kg)',
    'auth.height': 'Altura (cm)',
    'auth.goal': 'Objetivo Principal',
    'auth.level': 'Nível de Treino',
    'auth.terms': 'Aceito os termos e condições de uso da plataforma.',
    'auth.alreadyHave': 'Já tem uma conta? Entre aqui',
    'auth.dontHave': 'Não tem conta? Registre-se agora',
    'auth.forgotPass': 'Esqueceu sua senha?',
    'auth.recoverBtn': 'Enviar link de recuperação',
    'auth.keepConnected': 'Permanecer conectado',
    'auth.validation.email': 'Insira um e-mail válido.',
    'auth.validation.password': 'A senha deve ter no mínimo 6 caracteres.',
    'auth.validation.match': 'As senhas não coincidem.',
    'auth.validation.terms': 'Você deve aceitar os termos.',
    'auth.validation.fields': 'Todos os campos são obrigatórios.',

    // Dashboard
    'db.title': 'Painel Principal',
    'db.weight': 'Peso Atual',
    'db.target': 'Meta',
    'db.bmi': 'IMC',
    'db.todaysWorkout': 'Treino do Dia',
    'db.meals': 'Refeições',
    'db.water': 'Água',
    'db.sleep': 'Sono',
    'db.energy': 'Energia',
    'db.humor': 'Humor',
    'db.streak': 'Dias Seguidos',
    'db.weeklyProgress': 'Progresso Semanal',
    'db.checklist': 'Checklist Diário',
    'db.quickActions': 'Ações Rápidas',
    'db.action.startWorkout': 'Iniciar Treino',
    'db.action.logMeal': 'Registrar Refeição',
    'db.action.logEval': 'Registrar Avaliação',
    'db.action.seeEvol': 'Ver Evolução',

    // Menu Tabs
    'menu.dashboard': 'Painel',
    'menu.workouts': 'Treinos',
    'menu.diet': 'Dieta',
    'menu.habits': 'Hábitos',
    'menu.evaluations': 'Avaliações',
    'menu.evolution': 'Evolução',
    'menu.profile': 'Perfil',
    'menu.conquests': 'Conquistas',
    'menu.settings': 'Configurações',

    // Language & Appearance Settings
    'settings.title': 'Configurações',
    'settings.langApp': 'Idioma e Aparência',
    'settings.selectLang': 'Selecione o Idioma',
    'settings.selectTheme': 'Selecione a Aparência',
    'settings.theme.dark': '🌙 Tema Escuro',
    'settings.theme.light': '☀️ Tema Claro',
    'settings.backup.title': 'Backup e Exportação de Dados Offline',
    'settings.backup.desc': 'Exporte seus treinos, nutrição e medidas corporais armazenados localmente para garantir o backup do seu progresso, mesmo sem internet.',
    'settings.backup.btnJson': 'Exportar Backup Completo (JSON)',
    'settings.backup.btnNutritionCsv': 'Exportar Log de Nutrição (CSV)',
    'settings.backup.btnHabitsCsv': 'Exportar Log de Hábitos e Treinos (CSV)',
    'settings.backup.btnEvalsCsv': 'Exportar Avaliações Físicas (CSV)',
    'settings.backup.successToast': 'Backup exportado com sucesso no seu dispositivo!',
    'settings.backup.emptyData': 'Não há dados locais disponíveis para exportação.',

    // Diets
    'diet.title': 'Sua Dieta de Hipertrofia',
    'diet.calculated': 'Valores Diários Calculados',
    'diet.bmr': 'Taxa Metabólica Basal (TMB)',
    'diet.tdee': 'Gasto Energético Total (TDEE)',
    'diet.surplus': 'Meta para Ganho de Massa',
    'diet.macros': 'Divisão de Macronutrientes',
    'diet.proteins': 'Proteínas',
    'diet.carbs': 'Carboidratos',
    'diet.fats': 'Gorduras',
    'diet.logged': 'Histórico de Refeições de Hoje',
    'diet.addMeal': 'Adicionar Nova Refeição',
    'diet.mealType': 'Tipo de Refeição',
    'diet.time': 'Horário',
    'diet.searchFood': 'Pesquisar Alimento no Banco...',
    'diet.foodWeight': 'Peso (g)',
    'diet.addFood': 'Adicionar Alimento',
    'diet.totalLogged': 'Consumido Hoje',
    'diet.remaining': 'Restante',
    'diet.meal.cafe': 'Café da Manhã',
    'diet.meal.almoco': 'Almoço',
    'diet.meal.lanche': 'Lanche',
    'diet.meal.jantar': 'Jantar',
    'diet.meal.ceia': 'Ceia',

    // Habits
    'habits.title': 'Gerenciador de Hábitos Saudáveis',
    'habits.intro': 'Registre seus comportamentos diariamente para calcular seu Score de Saúde semanal.',
    'habits.sleep': 'Horas de Sono',
    'habits.water': 'Ingestão de Água (ml)',
    'habits.humor': 'Seu Humor de Hoje',
    'habits.energy': 'Nível de Energia (1-5)',
    'habits.stress': 'Nível de Estresse (1-5)',
    'habits.workout': 'Treinou Hoje?',
    'habits.sun': 'Exposição ao Sol (15 min+)?',
    'habits.suplementos': 'Tomou a Suplementação (Creatina/Whey)?',
    'habits.weeklyScore': 'Seu Score Semanal de Hábitos',
    'habits.scoreDesc': 'Sua dedicação é fundamental para acelerar o anabolismo e a saúde geral.',

    // Workouts
    'workouts.title': 'Sua Biblioteca de Treinos',
    'workouts.intro': 'Selecione uma periodização e acompanhe seus exercícios de forma interativa.',
    'workouts.exercises': 'Exercícios do Treino',
    'workouts.completeBtn': 'Concluir Treino de Hoje',
    'workouts.completed': 'Treino concluído hoje com sucesso! Parabéns!',
    'workouts.resting': 'Tempo de descanso recomendado:',

    // Evaluations
    'eval.title': 'Avaliação Física Semanal',
    'eval.intro': 'Registre suas medidas corporais para acompanhar a hipertrofia e alteração no percentual de gordura.',
    'eval.weight': 'Peso (kg)',
    'eval.bracoD': 'Braço Direito (cm)',
    'eval.bracoE': 'Braço Esquerdo (cm)',
    'eval.peito': 'Peito (cm)',
    'eval.cintura': 'Cintura (cm)',
    'eval.abdomen': 'Abdômen (cm)',
    'eval.quadril': 'Quadril (cm)',
    'eval.coxaD': 'Coxa Direita (cm)',
    'eval.coxaE': 'Coxa Esquerda (cm)',
    'eval.panturrilhaD': 'Panturrilha Direita (cm)',
    'eval.panturrilhaE': 'Panturrilha Esquerda (cm)',
    'eval.pescoco': 'Pescoço (cm)',
    'eval.bodyfat': 'Percentual de Gordura (%)',
    'eval.leanmass': 'Massa Magra (kg)',
    'eval.photos': 'Fotos de Acompanhamento (Frente, Costas, Lateral)',
    'eval.register': 'Registrar Nova Avaliação',
    'eval.history': 'Histórico de Avaliações',

    // Evolution
    'evol.title': 'Dashboard de Evolução',
    'evol.desc': 'Gráficos interativos para monitorar ganhos de massa muscular e diminuição de percentual de gordura.',
    'evol.weightChange': 'Variação de Peso',
    'evol.bmiChange': 'Variação de IMC',
    'evol.medidas': 'Variação de Circunferências',
    'evol.daysTrained': 'Frequência de Treino',

    // Conquests
    'conq.title': 'Conquistas e Gamificação',
    'conq.level': 'Nível do Atleta',
    'conq.nextLevel': 'Faltam {xp} XP para o próximo nível',
    'conq.history': 'Histórico Recente de Atividades',
    'conq.badges': 'Distintivos e Badges Desbloqueados',

    // Profile
    'profile.title': 'Perfil do Atleta',
    'profile.details': 'Dados Corporais Principais',
    'profile.days': 'Dias de uso ativo',
    'profile.edit': 'Editar Perfil do Atleta',
    'profile.reports': 'Relatórios & Exportações',
    'profile.exportPdf': 'Exportar Relatório PDF',
    'profile.exportExcel': 'Exportar Planilha Excel',
    'profile.statusPremium': 'Status da Assinatura',
    'profile.subscriptionActive': 'Status: Assinatura Premium Ativa (R$ 17,90/mês)',
    'profile.stripeCheckout': 'Gerenciar Pagamentos e Portal Stripe',
    'profile.merchant.title': 'Conexão para Recebimentos',
    'profile.merchant.desc': 'Conecte sua conta Strike ou Stripe para poder receber pagamentos diretamente de seus alunos ou clientes.',
    'profile.merchant.stripe': 'Conta Stripe Connect',
    'profile.merchant.strike': 'Conta Strike (Bitcoin / Lightning)',
    'profile.merchant.connected': 'Conectado',
    'profile.merchant.disconnected': 'Desconectado',
    'profile.merchant.connectBtn': 'Conectar Conta',
    'profile.merchant.disconnectBtn': 'Desconectar',
    'profile.merchant.setupTitle': 'Configurar Recebimentos',

    // Notifications Panel
    'notify.title': 'Central de Notificações e Mensagens',
    'notify.motivation': 'Mensagem Motivacional do Dia',
    'notify.reminders': 'Configurações de Lembretes Diários',
    'notify.waterRem': 'Lembrete de Água (a cada 2 horas)',
    'notify.workoutRem': 'Lembrete de Treino Diário',
    'notify.suplRem': 'Lembrete de Suplementação',
    'notify.mealRem': 'Lembrete de Refeições'
  },
  en: {
    // General
    'app.name': 'Project Alpha Premium',
    'app.slogan': 'Your evolution starts now.',
    'app.cta': 'START NOW',
    'app.subscribe': 'SUBSCRIBE NOW',
    'app.premium': 'Premium',
    'app.back': 'Back',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'app.success': 'Success',
    'app.error': 'Error',
    'app.edit': 'Edit',
    'app.loading': 'Loading...',
    'app.logout': 'Log Out',

    // Landing Page
    'lp.headline': 'Transform your body with strategy, technology and full guidance.',
    'lp.subheadline': 'Project Alpha Premium: The ultimate system for muscle mass gain, physical tracking, customized diets and high performance habits for those who seek real results.',
    'lp.price': '$17.90 per month',
    'lp.terms': 'No free trial • No lock-in • Secure payment',
    'lp.benefits': 'Exclusive Benefits',
    'lp.benefits.sub': 'Everything you need to reach your dream shape in a smart, scientific way.',
    'lp.benefit.1.title': 'Periodized Workouts',
    'lp.benefit.1.desc': 'Access optimized hypertrophy routines (ABC, ABCD, Push Pull Legs) designed by experts.',
    'lp.benefit.2.title': 'Scientific Nutrition',
    'lp.benefit.2.desc': 'Calculate your specific macronutrients for muscle gain based on your BMR and weight.',
    'lp.benefit.3.title': 'Evolution Charts',
    'lp.benefit.3.desc': 'Visually track variations in weight, BMI, body fat percentage and all body measurements.',
    'lp.benefit.4.title': 'Habits Tracker',
    'lp.benefit.4.desc': 'Log your water intake, sleep quality, mood, stress and supplementation daily.',
    'lp.how': 'How it Works?',
    'lp.how.1': '1. Create Your Profile',
    'lp.how.1.desc': 'Provide your measurements, current workout level and specific goals.',
    'lp.how.2': '2. Get Your Strategies',
    'lp.how.2.desc': 'The platform calculates your ideal macros and makes periodized workouts available.',
    'lp.how.3': '3. Monitor Your Habits',
    'lp.how.3.desc': 'Input your meals, daily workouts and sleep quality to earn XP.',
    'lp.how.4': '4. Evolve with Charts',
    'lp.how.4.desc': 'Do weekly physical evaluations and track your physical evolution with interactive charts.',
    'lp.premium.resources': 'Premium Resources',
    'lp.demo.title': 'Platform Demonstration',
    'lp.demo.desc': 'See an interactive preview of the premium dashboard that will optimize your daily results.',
    'lp.comp.title': 'Why Choose Project Alpha?',
    'lp.comp.desc': 'See the difference between staying basic and reaching the Alpha Premium level.',
    'lp.faq.title': 'Frequently Asked Questions (FAQ)',
    'lp.faq.1.q': 'How does the $17.90 billing work?',
    'lp.faq.1.a': 'It is a monthly recurring subscription via Stripe. You can cancel at any time with no additional costs or commitment.',
    'lp.faq.2.q': 'Can I change my goals after registration?',
    'lp.faq.2.a': 'Yes, at any time in your Profile you can change your weight, height or goal, and the macronutrient calculations will automatically update.',
    'lp.faq.3.q': 'Are workouts suitable for beginners?',
    'lp.faq.3.a': 'Yes, we have routines from Beginner to Advanced, in addition to classic periodizations like ABCDE and Push-Pull-Legs.',

    // Onboarding
    'on.title': 'Your Personalized Onboarding',
    'on.step1.title': 'Smart Workouts',
    'on.step1.desc': 'Complete periodizations adapted to your current level (Beginner, Intermediate and Advanced) with regulated loads and rests.',
    'on.step2.title': 'Customized Diets',
    'on.step2.desc': 'Instant calculation of Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE) and hypertrophy surplus.',
    'on.step3.title': 'Weekly Evaluations',
    'on.step3.desc': 'Track variations of muscular perimeters (arms, chest, waist) and body fat percentage.',
    'on.step4.title': 'Stable Physical Evolution',
    'on.step4.desc': 'Upload photos (front, back, side) and view your progress on premium chart panels.',
    'on.step5.title': 'Habits Control',
    'on.step5.desc': 'Control sleep, water, stress and sun exposure to raise your daily physical performance.',

    // Auth
    'auth.login.title': 'Log in to Alpha Premium',
    'auth.register.title': 'Create Premium Account',
    'auth.forgot.title': 'Recover Password',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.sex': 'Gender',
    'auth.age': 'Age',
    'auth.weight': 'Current Weight (kg)',
    'auth.height': 'Height (cm)',
    'auth.goal': 'Primary Goal',
    'auth.level': 'Workout Level',
    'auth.terms': 'I accept the terms and conditions of use of the platform.',
    'auth.alreadyHave': 'Already have an account? Log in here',
    'auth.dontHave': 'Don\'t have an account? Register now',
    'auth.forgotPass': 'Forgot your password?',
    'auth.recoverBtn': 'Send recovery link',
    'auth.keepConnected': 'Keep connected',
    'auth.validation.email': 'Please enter a valid email.',
    'auth.validation.password': 'Password must be at least 6 characters.',
    'auth.validation.match': 'Passwords do not match.',
    'auth.validation.terms': 'You must accept the terms.',
    'auth.validation.fields': 'All fields are required.',

    // Dashboard
    'db.title': 'Main Dashboard',
    'db.weight': 'Current Weight',
    'db.target': 'Goal',
    'db.bmi': 'BMI',
    'db.todaysWorkout': 'Workout of the Day',
    'db.meals': 'Meals',
    'db.water': 'Water',
    'db.sleep': 'Sleep',
    'db.energy': 'Energy',
    'db.humor': 'Mood',
    'db.streak': 'Consecutive Days',
    'db.weeklyProgress': 'Weekly Progress',
    'db.checklist': 'Daily Checklist',
    'db.quickActions': 'Quick Actions',
    'db.action.startWorkout': 'Start Workout',
    'db.action.logMeal': 'Log Meal',
    'db.action.logEval': 'Log Evaluation',
    'db.action.seeEvol': 'See Evolution',

    // Menu Tabs
    'menu.dashboard': 'Dashboard',
    'menu.workouts': 'Workouts',
    'menu.diet': 'Diet',
    'menu.habits': 'Habits',
    'menu.evaluations': 'Evaluations',
    'menu.evolution': 'Evolution',
    'menu.profile': 'Profile',
    'menu.conquests': 'Conquests',
    'menu.settings': 'Settings',

    // Language & Appearance Settings
    'settings.title': 'Settings',
    'settings.langApp': 'Language and Appearance',
    'settings.selectLang': 'Select Language',
    'settings.selectTheme': 'Select Appearance',
    'settings.theme.dark': '🌙 Dark Theme',
    'settings.theme.light': '☀️ Light Theme',
    'settings.backup.title': 'Offline Backup and Data Export',
    'settings.backup.desc': 'Export your locally stored workouts, nutrition, and body measurements to secure a backup of your progress, even when offline.',
    'settings.backup.btnJson': 'Export Full Backup (JSON)',
    'settings.backup.btnNutritionCsv': 'Export Nutrition Log (CSV)',
    'settings.backup.btnHabitsCsv': 'Export Habits & Workouts Log (CSV)',
    'settings.backup.btnEvalsCsv': 'Export Physical Evaluations (CSV)',
    'settings.backup.successToast': 'Backup successfully exported to your device!',
    'settings.backup.emptyData': 'No local data is currently available for export.',

    // Diets
    'diet.title': 'Your Hypertrophy Diet',
    'diet.calculated': 'Calculated Daily Values',
    'diet.bmr': 'Basal Metabolic Rate (BMR)',
    'diet.tdee': 'Total Daily Energy Expenditure (TDEE)',
    'diet.surplus': 'Target for Muscle Gain',
    'diet.macros': 'Macronutrient Split',
    'diet.proteins': 'Proteins',
    'diet.carbs': 'Carbohydrates',
    'diet.fats': 'Fats',
    'diet.logged': 'Today\'s Logged Meals',
    'diet.addMeal': 'Add New Meal',
    'diet.mealType': 'Meal Type',
    'diet.time': 'Time',
    'diet.searchFood': 'Search Food in Database...',
    'diet.foodWeight': 'Weight (g)',
    'diet.addFood': 'Add Food',
    'diet.totalLogged': 'Consumed Today',
    'diet.remaining': 'Remaining',
    'diet.meal.cafe': 'Breakfast',
    'diet.meal.almoco': 'Lunch',
    'diet.meal.lanche': 'Snack',
    'diet.meal.jantar': 'Dinner',
    'diet.meal.ceia': 'Supper',

    // Habits
    'habits.title': 'Healthy Habits Manager',
    'habits.intro': 'Log your daily behaviors to calculate your weekly Health Score.',
    'habits.sleep': 'Hours of Sleep',
    'habits.water': 'Water Intake (ml)',
    'habits.humor': 'Your Mood Today',
    'habits.energy': 'Energy Level (1-5)',
    'habits.stress': 'Stress Level (1-5)',
    'habits.workout': 'Worked out Today?',
    'habits.sun': 'Sun Exposure (15 mins+)?',
    'habits.suplementos': 'Took Supplementation (Creatine/Whey)?',
    'habits.weeklyScore': 'Your Weekly Habits Score',
    'habits.scoreDesc': 'Your dedication is essential to accelerate anabolism and overall health.',

    // Workouts
    'workouts.title': 'Your Workouts Library',
    'workouts.intro': 'Select a periodization and track your exercises interactively.',
    'workouts.exercises': 'Workout Exercises',
    'workouts.completeBtn': 'Complete Today\'s Workout',
    'workouts.completed': 'Workout completed successfully today! Congratulations!',
    'workouts.resting': 'Recommended resting time:',

    // Evaluations
    'eval.title': 'Weekly Physical Evaluation',
    'eval.intro': 'Log your body measurements to monitor hypertrophy and changes in body fat percentage.',
    'eval.weight': 'Weight (kg)',
    'eval.bracoD': 'Right Arm (cm)',
    'eval.bracoE': 'Left Arm (cm)',
    'eval.peito': 'Chest (cm)',
    'eval.cintura': 'Waist (cm)',
    'eval.abdomen': 'Abdomen (cm)',
    'eval.quadril': 'Hip (cm)',
    'eval.coxaD': 'Right Thigh (cm)',
    'eval.coxaE': 'Left Thigh (cm)',
    'eval.panturrilhaD': 'Right Calf (cm)',
    'eval.panturrilhaE': 'Left Calf (cm)',
    'eval.pescoco': 'Neck (cm)',
    'eval.bodyfat': 'Body Fat Percentage (%)',
    'eval.leanmass': 'Lean Mass (kg)',
    'eval.photos': 'Progress Photos (Front, Back, Side)',
    'eval.register': 'Register New Evaluation',
    'eval.history': 'Evaluations History',

    // Evolution
    'evol.title': 'Evolution Dashboard',
    'evol.desc': 'Interactive charts to monitor muscle mass gains and body fat percentage reduction.',
    'evol.weightChange': 'Weight Variation',
    'evol.bmiChange': 'BMI Variation',
    'evol.medidas': 'Circumferences Variation',
    'evol.daysTrained': 'Workout Frequency',

    // Conquests
    'conq.title': 'Conquests and Gamification',
    'conq.level': 'Athlete Level',
    'conq.nextLevel': '{xp} XP left for next level',
    'conq.history': 'Recent Activities History',
    'conq.badges': 'Unlocked Badges and Medals',

    // Profile
    'profile.title': 'Athlete Profile',
    'profile.details': 'Primary Body Data',
    'profile.days': 'Days of active use',
    'profile.edit': 'Edit Athlete Profile',
    'profile.reports': 'Reports & Exports',
    'profile.exportPdf': 'Export PDF Report',
    'profile.exportExcel': 'Export Excel Sheet',
    'profile.statusPremium': 'Subscription Status',
    'profile.subscriptionActive': 'Status: Active Premium Subscription ($17.90/mo)',
    'profile.stripeCheckout': 'Manage Payments & Stripe Portal',
    'profile.merchant.title': 'Payout Integrations',
    'profile.merchant.desc': 'Connect your Strike or Stripe account to receive payments directly from your students or clients.',
    'profile.merchant.stripe': 'Stripe Connect Account',
    'profile.merchant.strike': 'Strike Account (Bitcoin / Lightning)',
    'profile.merchant.connected': 'Connected',
    'profile.merchant.disconnected': 'Disconnected',
    'profile.merchant.connectBtn': 'Connect Account',
    'profile.merchant.disconnectBtn': 'Disconnect',
    'profile.merchant.setupTitle': 'Setup Payouts',

    // Notifications Panel
    'notify.title': 'Notifications and Messages Hub',
    'notify.motivation': 'Motivational Message of the Day',
    'notify.reminders': 'Daily Reminders Settings',
    'notify.waterRem': 'Water Reminder (every 2 hours)',
    'notify.workoutRem': 'Daily Workout Reminder',
    'notify.suplRem': 'Supplementation Reminder',
    'notify.mealRem': 'Meals Reminder'
  }
};

const LanguageThemeContextInstance = createContext<LanguageThemeContextType | undefined>(undefined);

export function LanguageThemeProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Load from local storage
    const storedLang = localStorage.getItem('alpha_language') as Language;
    const storedTheme = localStorage.getItem('alpha_theme') as Theme;

    if (storedLang) setLanguageState(storedLang);
    
    // Default to 'light' instead of 'dark'
    const initialTheme = storedTheme || 'light';
    setThemeState(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    if (!storedTheme) {
      localStorage.setItem('alpha_theme', 'light');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('alpha_language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('alpha_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const t = (key: string): string => {
    const translationsForLang = translations[language];
    return translationsForLang[key] || key;
  };

  return (
    <LanguageThemeContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      <div className={theme === 'dark' ? 'dark text-slate-100 bg-[#0A0E1A] min-h-screen antialiased transition-colors duration-300 selection:bg-blue-500/30' : 'text-slate-900 bg-[#F8FAFC] min-h-screen antialiased transition-colors duration-300 selection:bg-blue-600/20'}>
        {children}
      </div>
    </LanguageThemeContext.Provider>
  );
}

export function useLanguageTheme() {
  const context = useContext(LanguageThemeContext);
  if (!context) {
    throw new Error('useLanguageTheme must be used within a LanguageThemeProvider');
  }
  return context;
}
